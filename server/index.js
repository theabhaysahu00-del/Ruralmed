require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Data sanitization against NoSQL query injection
const sanitize = (obj) => {
  if (obj instanceof Object) {
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else {
        sanitize(obj[key]);
      }
    }
  }
  return obj;
};

const mongoSanitizeMiddleware = (req, res, next) => {
  // Skip sanitization for multipart/form-data requests (file uploads)
  // Multer handles those separately and sanitizing before Multer corrupts the body
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return next();
  }
  
  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);
  // req.query is often a getter in Express 5, so we handle it carefully
  try {
    const originalQuery = req.query;
    const sanitizedQuery = sanitize({ ...originalQuery });
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: true,
      configurable: true
    });
  } catch (e) {
    // Silently skip if query can't be overwritten
  }
  next();
};
// Custom XSS sanitization (xss-clean is incompatible with Express 5's getter-only req.query)
const sanitizeXSS = (obj) => {
  if (typeof obj === 'string') {
    return obj.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/javascript:/gi, '');
  }
  if (obj instanceof Object) {
    for (const key in obj) {
      obj[key] = sanitizeXSS(obj[key]);
    }
  }
  return obj;
};

const xssSanitizeMiddleware = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) return next();
  if (req.body) req.body = sanitizeXSS(req.body);
  next();
};

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

const connectDB = require('./src/config/db');
const seedAdmin = require('./src/utils/seedAdmin');
const errorHandler = require('./src/middlewares/errorHandler');
const logger = require('./src/utils/logger');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const prescriptionRoutes = require('./src/routes/prescriptionRoutes');
const pharmacyRoutes = require('./src/routes/pharmacyRoutes');
const symptomRoutes = require('./src/routes/symptomRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const deliveryRoutes = require('./src/routes/deliveryRoutes');
const medicineRoutes = require('./src/routes/medicineRoutes');
const medicineOrderRoutes = require('./src/routes/medicineOrderRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io for WebRTC Signaling
const io = new Server(server, {
  cors: { origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5174'], credentials: true },
});

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({ 
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5174'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })); // Must be after cors()
app.use(express.json({ limit: '50mb' })); // Body parser
app.use(cookieParser());
app.use(mongoSanitizeMiddleware); // Data sanitization against NoSQL query injection
app.use(xssSanitizeMiddleware); // Data sanitization against XSS (Express 5 compatible)
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use('/api', limiter); // Apply rate limiting to all API routes

// ─── API Routes ─────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({ message: 'Rural Telemedicine API v1.0', status: 'running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/symptom-checker', symptomRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/medicine-orders', medicineOrderRoutes);

// ─── Centralized Error Handler ──────────────────────────────
app.use(errorHandler);

// ─── Socket.io WebRTC Signaling ─────────────────────────────
const activeRooms = new Map();

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    logger.info(`User ${userId} joined room ${roomId}`);

    if (!activeRooms.has(roomId)) activeRooms.set(roomId, new Set());
    activeRooms.get(roomId).add(userId);
  });

  socket.on('join', (userId) => {
    socket.join(userId);
    logger.info(`User ${userId} joined their private chat room`);
  });

  socket.on('sendMessage', (data) => {
    const { receiverId } = data;
    socket.to(receiverId).emit('message', data);
    logger.info(`Message sent from ${data.senderId} to ${receiverId}`);
  });

  socket.on('offer', (data) => socket.to(data.roomId).emit('offer', data));
  socket.on('answer', (data) => socket.to(data.roomId).emit('answer', data));
  socket.on('ice-candidate', (data) => socket.to(data.roomId).emit('ice-candidate', data));

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// ─── Start Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedAdmin();
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`WebSocket signaling active`);
  }); // Triggering restart for dependency updates
});