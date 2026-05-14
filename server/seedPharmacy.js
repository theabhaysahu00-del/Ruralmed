const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('./src/models/Medicine');
const MedicineOrder = require('./src/models/MedicineOrder');
const User = require('./src/models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ruralmed';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Get a Pharmacy and a Patient from User model
    const pharmacyUser = await User.findOne({ email: 'starabhay2005@gmail.com', role: 'pharmacy' });
    const patientUser = await User.findOne({ email: 'testpatient@gmail.com', role: 'patient' });

    if (!pharmacyUser || !patientUser) {
      console.error('Pharmacy User or Patient User not found. Please run setupUsers.js first.');
      process.exit(1);
    }

    console.log(`Seeding data for Pharmacy: ${pharmacyUser.name}`);

    // 2. Clear existing medicines and orders for this pharmacy to avoid duplicates
    await Medicine.deleteMany({ pharmacy: pharmacyUser._id });
    await MedicineOrder.deleteMany({ pharmacyId: pharmacyUser._id });

    // 3. Seed Medicines
    const medicinesData = [
      { name: 'Paracetamol 650mg', category: 'Tablet', price: 15, stock: 150, manufacturer: 'GSK', description: 'Pain relief and fever reduction', expiryDate: new Date('2026-12-01'), requiresPrescription: false },
      { name: 'Amoxicillin 500mg', category: 'Capsule', price: 45, stock: 80, manufacturer: 'Cipla', description: 'Broad-spectrum antibiotic', expiryDate: new Date('2025-08-15'), requiresPrescription: true },
      { name: 'Cetirizine 10mg', category: 'Tablet', price: 10, stock: 200, manufacturer: 'Dr. Reddys', description: 'Anti-allergy medication', expiryDate: new Date('2026-05-20'), requiresPrescription: false },
      { name: 'Azithromycin 500mg', category: 'Tablet', price: 75, stock: 5, manufacturer: 'Pfizer', description: 'Bacterial infection treatment', expiryDate: new Date('2024-06-30'), requiresPrescription: true },
      { name: 'Cough Syrup (Cherry)', category: 'Syrup', price: 120, stock: 40, manufacturer: 'Abbott', description: 'Dry cough relief', expiryDate: new Date('2025-11-10'), requiresPrescription: false },
      { name: 'Insulin Glargine', category: 'Injection', price: 850, stock: 2, manufacturer: 'Sanofi', description: 'Long-acting insulin for diabetes', expiryDate: new Date('2024-07-15'), requiresPrescription: true },
      { name: 'Metformin 500mg', category: 'Tablet', price: 25, stock: 300, manufacturer: 'Sun Pharma', description: 'Type 2 diabetes management', expiryDate: new Date('2026-01-10'), requiresPrescription: false },
      { name: 'Vicks Vaporub', category: 'Ointment', price: 65, stock: 50, manufacturer: 'P&G', description: 'Cold and congestion relief', expiryDate: new Date('2027-03-01'), requiresPrescription: false }
    ];

    const createdMedicines = await Medicine.insertMany(
      medicinesData.map(m => ({ ...m, pharmacy: pharmacyUser._id }))
    );
    console.log(`Inserted ${createdMedicines.length} medicines.`);

    // 4. Seed Orders
    const ordersData = [
      {
        patientId: patientUser._id,
        pharmacyId: pharmacyUser._id,
        items: [
          { medicineId: createdMedicines[0]._id, name: createdMedicines[0].name, quantity: 2, price: createdMedicines[0].price },
          { medicineId: createdMedicines[2]._id, name: createdMedicines[2].name, quantity: 1, price: createdMedicines[2].price }
        ],
        totalAmount: 40,
        status: 'delivered',
        deliveryAddress: 'House 42, Village Rampur',
        patientName: patientUser.name,
        patientPhone: patientUser.phone,
        trackingId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        patientId: patientUser._id,
        pharmacyId: pharmacyUser._id,
        items: [
          { medicineId: createdMedicines[1]._id, name: createdMedicines[1].name, quantity: 1, price: createdMedicines[1].price }
        ],
        totalAmount: 45,
        status: 'preparing',
        deliveryAddress: 'Gali 5, Sector 2',
        patientName: 'Sita Devi',
        patientPhone: '9988776655',
        trackingId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        patientId: patientUser._id,
        pharmacyId: pharmacyUser._id,
        items: [
          { medicineId: createdMedicines[4]._id, name: createdMedicines[4].name, quantity: 3, price: createdMedicines[4].price }
        ],
        totalAmount: 360,
        status: 'pending',
        deliveryAddress: 'Near Primary School, Village Pipra',
        patientName: 'Amit Singh',
        patientPhone: '8877665544',
        trackingId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        createdAt: new Date()
      }
    ];

    await MedicineOrder.insertMany(ordersData);
    console.log(`Inserted ${ordersData.length} orders.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
