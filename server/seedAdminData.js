/**
 * seedAdminData.js — Seeds realistic healthcare demo data for the Admin Portal
 * 
 * Run: node seedAdminData.js
 * 
 * Creates:
 *  - 1 Admin account
 *  - 8 Doctors (various specializations, some pending)
 *  - 15 Patients (various villages)
 *  - 3 Pharmacies
 *  - 30+ Appointments (mixed statuses)
 *  - 10+ Prescriptions
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ruralmed';

// ─── Schemas (inline to avoid path issues) ─────────────────────────────────

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'pharmacy', 'admin'], default: 'patient' },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  verificationStage: { type: String, enum: ['submitted', 'under_review', 'approved', 'rejected'], default: 'submitted' },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  village: { type: String, default: '' },
  language: { type: String, enum: ['en', 'hi'], default: 'en' },
  isDeleted: { type: Boolean, default: false },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
  specialization: { type: String },
  clinicName: { type: String },
  experience: { type: String },
  licenseNumber: { type: String },
  medicalLicenseFile: { type: String },
  hospital: { type: String },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patientName: String,
  patientPhone: String,
  patientEmail: String,
  doctorName: String,
  department: String,
  date: Date,
  time: String,
  consultationType: { type: String, default: 'video' },
  problemDescription: String,
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

const prescriptionSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  diagnosis: String,
  medicines: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
  }],
  notes: String,
  status: { type: String, default: 'active' },
}, { timestamps: true });

const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);

// ─── Data ──────────────────────────────────────────────────────────────────

const doctors = [
  { name: 'Dr. Rajesh Sharma', email: 'rajesh@ruralmed.in', phone: '9876543210', specialization: 'Cardiologist', hospital: 'City Heart Hospital', experience: '12', approvalStatus: 'approved', verificationStage: 'approved' },
  { name: 'Dr. Priya Verma', email: 'priya@ruralmed.in', phone: '9876543211', specialization: 'Gynecologist', hospital: 'Mother Care Clinic', experience: '8', approvalStatus: 'approved', verificationStage: 'approved' },
  { name: 'Dr. Amit Gupta', email: 'amit@ruralmed.in', phone: '9876543212', specialization: 'Pediatrician', hospital: 'Child Care Center', experience: '15', approvalStatus: 'approved', verificationStage: 'approved' },
  { name: 'Dr. Sneha Rao', email: 'sneha@ruralmed.in', phone: '9876543213', specialization: 'Dermatologist', hospital: 'Skin Solutions', experience: '6', approvalStatus: 'approved', verificationStage: 'approved' },
  { name: 'Dr. Vikram Singh', email: 'vikram@ruralmed.in', phone: '9876543214', specialization: 'Orthopedic', hospital: 'Bone & Joint Clinic', experience: '10', approvalStatus: 'approved', verificationStage: 'approved' },
  { name: 'Dr. Anita Desai', email: 'anita@ruralmed.in', phone: '9876543215', specialization: 'Neurologist', hospital: 'Neuro Care', experience: '9', approvalStatus: 'pending', verificationStage: 'submitted' },
  { name: 'Dr. Sanjay Patel', email: 'sanjay@ruralmed.in', phone: '9876543216', specialization: 'ENT', hospital: 'Rural Health Center', experience: '4', approvalStatus: 'pending', verificationStage: 'under_review' },
  { name: 'Dr. Meera Joshi', email: 'meera@ruralmed.in', phone: '9876543217', specialization: 'General Physician', hospital: 'Village Health Post', experience: '3', approvalStatus: 'rejected', verificationStage: 'rejected' },
];

const patients = [
  { name: 'Ramesh Kumar', email: 'ramesh@patient.in', phone: '8765432101', village: 'Kishanpur' },
  { name: 'Sita Devi', email: 'sita@patient.in', phone: '8765432102', village: 'Rampur' },
  { name: 'Suresh Yadav', email: 'suresh@patient.in', phone: '8765432103', village: 'Madhavgarh' },
  { name: 'Geeta Sharma', email: 'geeta@patient.in', phone: '8765432104', village: 'Vijaypur' },
  { name: 'Mohan Lal', email: 'mohan@patient.in', phone: '8765432105', village: 'Talwara' },
  { name: 'Sunita Verma', email: 'sunita@patient.in', phone: '8765432106', village: 'Kishanpur' },
  { name: 'Raj Patel', email: 'raj@patient.in', phone: '8765432107', village: 'Rampur' },
  { name: 'Kavita Singh', email: 'kavita@patient.in', phone: '8765432108', village: 'Madhavgarh' },
  { name: 'Arun Mishra', email: 'arun@patient.in', phone: '8765432109', village: 'Vijaypur' },
  { name: 'Priya Kumari', email: 'priyak@patient.in', phone: '8765432110', village: 'Talwara' },
  { name: 'Deepak Tiwari', email: 'deepak@patient.in', phone: '8765432111', village: 'Kishanpur' },
  { name: 'Anita Gupta', email: 'anitag@patient.in', phone: '8765432112', village: 'Rampur' },
  { name: 'Vijay Chauhan', email: 'vijay@patient.in', phone: '8765432113', village: 'Madhavgarh' },
  { name: 'Renu Devi', email: 'renu@patient.in', phone: '8765432114', village: 'Vijaypur' },
  { name: 'Sanjay Thakur', email: 'sanjayt@patient.in', phone: '8765432115', village: 'Talwara' },
];

const pharmacies = [
  { name: 'City Pharma', email: 'city@pharma.in', phone: '7654321001', clinicName: 'City Pharma Store', village: 'Kishanpur' },
  { name: 'Rural Care Pharmacy', email: 'rural@pharma.in', phone: '7654321002', clinicName: 'Rural Care', village: 'Rampur' },
  { name: 'Apex Medicals', email: 'apex@pharma.in', phone: '7654321003', clinicName: 'Apex Meds', village: 'Madhavgarh' },
];

const symptoms = [
  'Chest pain and shortness of breath',
  'Persistent headache and dizziness',
  'Skin rash and itching',
  'Fever with body aches',
  'Joint pain and swelling',
  'Abdominal pain and nausea',
  'Cough and sore throat',
  'Back pain radiating to legs',
  'Irregular heartbeat',
  'Vision problems',
  'Ear pain and hearing issues',
  'Pregnancy checkup',
  'Child vaccination',
  'Dental pain',
  'General wellness check',
];

const diagnoses = [
  'Viral fever with upper respiratory infection',
  'Hypertension Stage 1',
  'Allergic dermatitis',
  'Acute gastritis',
  'Cervical spondylosis',
  'Type 2 Diabetes monitoring',
  'Iron deficiency anemia',
  'Seasonal allergies',
];

const medicines = [
  { name: 'Paracetamol 500mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days' },
  { name: 'Amoxicillin 250mg', dosage: '1 capsule', frequency: 'Thrice daily', duration: '7 days' },
  { name: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'Once daily', duration: '10 days' },
  { name: 'Omeprazole 20mg', dosage: '1 capsule', frequency: 'Before breakfast', duration: '14 days' },
  { name: 'Vitamin D3 60K', dosage: '1 sachet', frequency: 'Once weekly', duration: '8 weeks' },
  { name: 'Metformin 500mg', dosage: '1 tablet', frequency: 'After meals', duration: '30 days' },
  { name: 'Ibuprofen 400mg', dosage: '1 tablet', frequency: 'After food', duration: '5 days' },
  { name: 'ORS Sachets', dosage: '1 sachet in 1L water', frequency: 'As needed', duration: '3 days' },
];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomDate(daysBack, daysForward = 0) {
  const now = Date.now();
  const start = now - daysBack * 86400000;
  const end = now + daysForward * 86400000;
  return new Date(start + Math.random() * (end - start));
}
function randomTime() {
  const h = Math.floor(Math.random() * 10) + 8; // 8am - 6pm
  const m = Math.random() > 0.5 ? '00' : '30';
  return `${h.toString().padStart(2, '0')}:${m}`;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB:', MONGO_URI);

  // Clean demo data (only entries we'll recreate)
  const demoEmails = [
    ...doctors.map(d => d.email),
    ...patients.map(p => p.email),
    ...pharmacies.map(p => p.email),
  ];
  await User.deleteMany({ email: { $in: demoEmails } });
  console.log('🧹 Cleaned previous demo data');

  // Create Admin (only if doesn't exist)
  let admin = await User.findOne({ email: 'admin@ruralmed.in' });
  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email: 'admin@ruralmed.in',
      password: 'Admin@123',
      phone: '9999999999',
      role: 'admin',
      approvalStatus: 'approved',
      verificationStage: 'approved',
    });
    console.log('👤 Admin account created: admin@ruralmed.in / Admin@123');
  } else {
    console.log('👤 Admin account already exists');
  }

  // Create Doctors
  const createdDoctors = [];
  for (const doc of doctors) {
    const d = await User.create({
      ...doc,
      password: 'Doctor@123',
      role: 'doctor',
      isActive: doc.approvalStatus === 'approved',
    });
    createdDoctors.push(d);
  }
  console.log(`🩺 Created ${createdDoctors.length} doctors`);

  // Create Patients
  const createdPatients = [];
  for (const pat of patients) {
    const p = await User.create({
      ...pat,
      password: 'Patient@123',
      role: 'patient',
      approvalStatus: 'approved',
      verificationStage: 'approved',
    });
    createdPatients.push(p);
  }
  console.log(`👥 Created ${createdPatients.length} patients`);

  // Create Pharmacies
  for (const ph of pharmacies) {
    await User.create({
      ...ph,
      password: 'Pharmacy@123',
      role: 'pharmacy',
      approvalStatus: 'approved',
      verificationStage: 'approved',
    });
  }
  console.log(`💊 Created ${pharmacies.length} pharmacies`);

  // Clean old appointments/prescriptions for demo data
  const doctorIds = createdDoctors.map(d => d._id);
  const patientIds = createdPatients.map(p => p._id);
  await Appointment.deleteMany({ $or: [{ doctorId: { $in: doctorIds } }, { patientId: { $in: patientIds } }] });
  await Prescription.deleteMany({ $or: [{ doctorId: { $in: doctorIds } }, { patientId: { $in: patientIds } }] });

  // Create Appointments
  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  const types = ['video', 'in-person'];
  const createdAppointments = [];
  const approvedDoctors = createdDoctors.filter(d => d.approvalStatus === 'approved');

  for (let i = 0; i < 35; i++) {
    const doc = randomFrom(approvedDoctors);
    const pat = randomFrom(createdPatients);
    const apt = await Appointment.create({
      patientId: pat._id,
      doctorId: doc._id,
      patientName: pat.name,
      patientPhone: pat.phone,
      patientEmail: pat.email,
      doctorName: doc.name,
      department: doc.specialization,
      date: randomDate(30, 14),
      time: randomTime(),
      consultationType: randomFrom(types),
      problemDescription: randomFrom(symptoms),
      status: randomFrom(statuses),
    });
    createdAppointments.push(apt);
  }
  console.log(`📅 Created ${createdAppointments.length} appointments`);

  // Create Prescriptions (from completed appointments)
  const completedApts = createdAppointments.filter(a => a.status === 'completed');
  let prescriptionCount = 0;
  for (const apt of completedApts.slice(0, 12)) {
    const numMeds = Math.floor(Math.random() * 3) + 1;
    const selectedMeds = [];
    for (let m = 0; m < numMeds; m++) {
      selectedMeds.push(randomFrom(medicines));
    }
    await Prescription.create({
      doctorId: apt.doctorId,
      patientId: apt.patientId,
      appointmentId: apt._id,
      diagnosis: randomFrom(diagnoses),
      medicines: selectedMeds,
      notes: 'Follow up in 1 week. Avoid spicy food. Rest well.',
      status: 'active',
    });
    prescriptionCount++;
  }
  console.log(`💉 Created ${prescriptionCount} prescriptions`);

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  ✅  ADMIN PORTAL DEMO DATA SEEDED SUCCESSFULLY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Admin Login:    admin@ruralmed.in / Admin@123');
  console.log('  Doctor Login:   rajesh@ruralmed.in / Doctor@123');
  console.log('  Patient Login:  ramesh@patient.in / Patient@123');
  console.log('  Pharmacy Login: city@pharma.in / Pharmacy@123');
  console.log('═══════════════════════════════════════════════════════════\n');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
