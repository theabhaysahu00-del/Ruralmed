const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('MongoDB connected');
  
  const User = require('./src/models/User');
  const Appointment = require('./src/models/Appointment');
  const Patient = require('./src/models/Patient');
  const Prescription = require('./src/models/Prescription');


  let doctor = await User.findOne({ email: 'ashish@doctor.com' });
  if (!doctor) {
    doctor = await User.create({
      name: 'Ashish',
      email: 'ashish@doctor.com',
      password: 'Ashish@123',
      phone: '9999999999',
      role: 'doctor',
      department: 'Cardiology',
      specialization: 'Cardiologist',
      experience: '10',
      hospital: 'RuralMed General',
      licenseNumber: 'DOC-12345',
      approvalStatus: 'approved',
      verificationStage: 'approved',
    });
    console.log('Created doctor Ashish');
  } else {
    doctor.approvalStatus = 'approved';
    doctor.name = 'Ashish';
    doctor.verificationStage = 'approved';
    await doctor.save();
    console.log('Updated doctor Ashish');
  }

  // Seed demo data
  // 1. Patient
  let patient = await User.findOne({ email: 'demo@patient.com' });
  if (!patient) {
    patient = await User.create({
      name: 'Rahul Kumar',
      email: 'demo@patient.com',
      password: 'Patient@123',
      phone: '8888888888',
      role: 'patient',
    });
    console.log('Created demo patient');
  }

  // 2. Appointments
  await Appointment.deleteMany({ doctorId: doctor._id });
  await Appointment.create([
    {
      patientId: patient._id,
      patientName: patient.name,
      patientPhone: patient.phone,
      patientEmail: patient.email,
      department: 'Cardiology',
      doctorId: doctor._id,
      doctorName: doctor.name,
      date: new Date(),
      time: '10:00 AM',
      consultationType: 'video',
      problemDescription: 'Chest pain and shortness of breath',
      status: 'pending'
    },
    {
      patientId: patient._id,
      patientName: 'Sneha Patel',
      patientPhone: '7777777777',
      patientEmail: 'sneha@patient.com',
      department: 'Cardiology',
      doctorId: doctor._id,
      doctorName: doctor.name,
      date: new Date(),
      time: '11:30 AM',
      consultationType: 'in-person',
      problemDescription: 'Regular checkup',
      status: 'confirmed'
    }
  ]);
  console.log('Created demo appointments');

  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
