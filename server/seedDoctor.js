const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Appointment = require('./src/models/Appointment');
const Patient = require('./src/models/Patient');

dotenv.config({ path: './server/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/telemedicine';

const seedDoctorData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding Doctor Ashish...');

    // 1. Create Doctor User
    let doctorUser = await User.findOne({ email: 'ashish@gmail.com', role: 'doctor' });
    if (!doctorUser) {
      console.log('Creating Doctor Ashish...');
      doctorUser = await User.create({
        name: 'Dr. Ashish',
        email: 'ashish@gmail.com',
        password: 'password123',
        phone: '9876543211',
        role: 'doctor',
        approvalStatus: 'approved',
        specialization: 'Cardiologist',
        clinicName: 'Heart Care Center',
        experience: '12 Years',
        licenseNumber: 'MD-12345',
        hospital: 'Apollo Hospital'
      });
    }

    // 2. Create 10 dummy patients for appointments
    const patientNames = ['Suresh Kumar', 'Anita Singh', 'Rajeev Patel', 'Kavita Sharma', 'Arun Verma', 'Sneha Gupta', 'Vikram Singh', 'Pooja Reddy', 'Ramesh Yadav', 'Deepa Nair'];
    const patientUsers = [];

    for (let i = 0; i < patientNames.length; i++) {
      let email = `patient${i}@test.com`;
      let pUser = await User.findOne({ email });
      if (!pUser) {
          pUser = await User.create({
              name: patientNames[i],
              email: email,
              password: 'password123',
              phone: `9999999${i.toString().padStart(3, '0')}`,
              role: 'patient'
          });
      }
      patientUsers.push(pUser);
      
      // Also ensure Patient profile exists
      let pProfile = await Patient.findOne({ userId: pUser._id });
      if (!pProfile) {
          await Patient.create({
              userId: pUser._id,
              age: Math.floor(Math.random() * 50) + 20,
              gender: Math.random() > 0.5 ? 'male' : 'female',
              medicalHistory: ['Hypertension', 'Diabetes (Type 2)'],
              bloodGroup: 'O+'
          });
      }
    }

    // Clear old appointments for this doctor to avoid duplicates
    await Appointment.deleteMany({ doctorId: doctorUser._id });

    // 3. Create 25 Appointments (Upcoming, Completed, Pending, Cancelled)
    const appointmentsData = [];
    const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    const types = ['video', 'in-person'];
    const symptomsList = ['Chest pain', 'High blood pressure', 'Irregular heartbeat', 'Shortness of breath', 'General checkup', 'Follow-up'];

    for (let i = 0; i < 25; i++) {
      const pUser = patientUsers[Math.floor(Math.random() * patientUsers.length)];
      const date = new Date();
      // Mix of past and future dates
      date.setDate(date.getDate() + (Math.floor(Math.random() * 14) - 7)); 
      
      // If date is in the past, it's mostly completed or cancelled
      let status = statuses[Math.floor(Math.random() * statuses.length)];
      if (date < new Date()) {
          status = Math.random() > 0.8 ? 'cancelled' : 'completed';
      } else {
          status = Math.random() > 0.5 ? 'confirmed' : 'pending';
      }

      appointmentsData.push({
        patientId: pUser._id,
        doctorId: doctorUser._id,
        patientName: pUser.name,
        patientPhone: pUser.phone,
        patientEmail: pUser.email,
        doctorName: doctorUser.name,
        department: doctorUser.specialization,
        date: date,
        time: `${Math.floor(Math.random() * 8) + 9}:00 AM`,
        problemDescription: symptomsList[Math.floor(Math.random() * symptomsList.length)],
        consultationType: types[Math.floor(Math.random() * types.length)],
        status: status,
        notes: status === 'completed' ? 'Patient is doing well. BP normal.' : ''
      });
    }

    await Appointment.insertMany(appointmentsData);
    const Prescription = require('./src/models/Prescription');
    await Prescription.deleteMany({ doctorId: doctorUser._id });

    const prescriptionsData = [];
    const completedApps = appointmentsData.filter(a => a.status === 'completed');
    
    // Convert to inserted DB objects to get their IDs
    const insertedApps = await Appointment.find({ doctorId: doctorUser._id, status: 'completed' });
    
    for (let app of insertedApps) {
      prescriptionsData.push({
        doctorId: doctorUser._id,
        patientId: app.patientId,
        appointmentId: app._id,
        diagnosis: app.problemDescription,
        medicines: [
          { name: 'Paracetamol 500mg', dosage: '1 tablet', frequency: 'Twice a day', duration: '5 days' },
          { name: 'Amoxicillin 250mg', dosage: '1 capsule', frequency: 'Three times a day', duration: '7 days' }
        ],
        notes: 'Take medicine after meals. Drink plenty of water.',
        status: 'issued'
      });
    }

    if (prescriptionsData.length > 0) {
        await Prescription.insertMany(prescriptionsData);
        console.log(`Inserted ${prescriptionsData.length} prescriptions for Dr. Ashish.`);
    }

    console.log('Seeding completed successfully for ashish@gmail.com!');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
};

seedDoctorData();
