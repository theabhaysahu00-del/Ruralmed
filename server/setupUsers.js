const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Patient = require('./src/models/Patient');
const Pharmacy = require('./src/models/Pharmacy');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ruralmed';

const setupUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB...');

    // 1. Setup Pharmacy User
    let pharmacyUser = await User.findOne({ email: 'starabhay2005@gmail.com' });
    if (!pharmacyUser) {
      console.log('Creating pharmacy user...');
      pharmacyUser = await User.create({
        name: 'Rural Care Pharmacy',
        email: 'starabhay2005@gmail.com',
        password: 'password123',
        phone: '9988776655',
        role: 'pharmacy',
        village: 'Rampur'
      });
    }

    let pharmacy = await Pharmacy.findOne({ userId: pharmacyUser._id });
    if (!pharmacy) {
      console.log('Creating pharmacy record...');
      pharmacy = await Pharmacy.create({
        name: 'Rural Care Pharmacy',
        licenseNumber: 'LIC-2024-001',
        address: 'Main Market, Village Rampur',
        village: 'Rampur',
        userId: pharmacyUser._id
      });
    }

    // 2. Setup Patient User
    let patientUser = await User.findOne({ email: 'testpatient@gmail.com' });
    if (!patientUser) {
      console.log('Creating patient user...');
      patientUser = await User.create({
        name: 'Rahul Kumar',
        email: 'testpatient@gmail.com',
        password: 'password123',
        phone: '9876543210',
        role: 'patient',
        village: 'Pipra'
      });
    }

    let patient = await Patient.findOne({ userId: patientUser._id });
    if (!patient) {
      console.log('Creating patient record...');
      patient = await Patient.create({
        userId: patientUser._id,
        age: 28,
        gender: 'male',
        medicalHistory: ['Mild seasonal allergies'],
        bloodGroup: 'O+'
      });
    }

    console.log('Setup completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error during setup:', err);
    process.exit(1);
  }
};

setupUsers();
