const mongoose = require('mongoose');

// Enable strictQuery to suppress deprecation warnings and follow future defaults
mongoose.set('strictQuery', true);

const logger = require('../utils/logger');

const connectDB = async (retryCount = 5) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('MongoDB Connected Successfully');
    console.log('MongoDB Connected Successfully'); // Direct console log as requested
  } catch (error) {
    logger.error('Database Connection Failed');
    console.error('Database Connection Failed'); // Direct console log as requested
    logger.error(`Error details: ${error.message}`);
    
    if (retryCount > 0) {
      const waitTime = Math.pow(2, 5 - retryCount) * 1000;
      logger.info(`Retrying MongoDB connection in ${waitTime / 1000}s... (${retryCount} retries left)`);
      setTimeout(() => connectDB(retryCount - 1), waitTime);
    } else {
      logger.error('Max MongoDB connection retries reached. Exiting...');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
