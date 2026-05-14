const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('./src/models/Medicine');
const MedicineOrder = require('./src/models/MedicineOrder');
const User = require('./src/models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ruralmed';

const seedAdvancedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for Advanced Seeding...');

    const pharmacyUser = await User.findOne({ email: 'starabhay2005@gmail.com', role: 'pharmacy' });
    const patientUser = await User.findOne({ email: 'testpatient@gmail.com', role: 'patient' });

    if (!pharmacyUser || !patientUser) {
      console.error('Pharmacy User or Patient User not found. Please run setupUsers.js first.');
      process.exit(1);
    }

    // Clear existing data to avoid mess
    await Medicine.deleteMany({ pharmacy: pharmacyUser._id });
    await MedicineOrder.deleteMany({ pharmacyId: pharmacyUser._id });

    // 1. SEED 20 MEDICINES
    const medicinesData = [
      { name: 'Paracetamol 650mg', category: 'Tablet', price: 35, stock: 120, manufacturer: 'GSK', description: 'Pain relief and fever reduction', expiryDate: new Date('2026-12-01'), requiresPrescription: false },
      { name: 'Azithromycin 500mg', category: 'Antibiotic', price: 120, stock: 24, manufacturer: 'Cipla', description: 'Bacterial infection treatment', expiryDate: new Date('2025-08-15'), requiresPrescription: true },
      { name: 'ORS Powder', category: 'Powder', price: 20, stock: 78, manufacturer: 'Dr. Reddys', description: 'Rehydration salts', expiryDate: new Date('2026-05-20'), requiresPrescription: false },
      { name: 'Cough Syrup (Benadryl)', category: 'Syrup', price: 95, stock: 8, manufacturer: 'Abbott', description: 'Cough and cold relief', expiryDate: new Date('2025-11-10'), requiresPrescription: false },
      { name: 'Insulin Glargine', category: 'Injection', price: 450, stock: 0, manufacturer: 'Sanofi', description: 'Diabetes management', expiryDate: new Date('2024-07-15'), requiresPrescription: true },
      { name: 'Metformin 500mg', category: 'Tablet', price: 25, stock: 300, manufacturer: 'Sun Pharma', description: 'Type 2 diabetes management', expiryDate: new Date('2026-01-10'), requiresPrescription: false },
      { name: 'Vicks Vaporub', category: 'Ointment', price: 65, stock: 50, manufacturer: 'P&G', description: 'Congestion relief', expiryDate: new Date('2027-03-01'), requiresPrescription: false },
      { name: 'Cetirizine 10mg', category: 'Tablet', price: 15, stock: 180, manufacturer: 'Dr. Reddys', description: 'Anti-allergy', expiryDate: new Date('2026-08-12'), requiresPrescription: false },
      { name: 'Amoxicillin 250mg', category: 'Capsule', price: 40, stock: 45, manufacturer: 'Cipla', description: 'Antibiotic for kids', expiryDate: new Date('2025-02-28'), requiresPrescription: true },
      { name: 'Pantoprazole 40mg', category: 'Tablet', price: 55, stock: 110, manufacturer: 'Zydus', description: 'Acidity and heartburn relief', expiryDate: new Date('2026-11-05'), requiresPrescription: false },
      { name: 'Diclofenac Gel', category: 'Ointment', price: 85, stock: 35, manufacturer: 'Volini', description: 'Muscle pain relief', expiryDate: new Date('2027-01-20'), requiresPrescription: false },
      { name: 'Vitamin D3 60K', category: 'Capsule', price: 150, stock: 15, manufacturer: 'Lupin', description: 'Bone health supplement', expiryDate: new Date('2026-05-25'), requiresPrescription: false },
      { name: 'Telmisartan 40mg', category: 'Tablet', price: 90, stock: 65, manufacturer: 'Glenmark', description: 'Blood pressure control', expiryDate: new Date('2025-12-30'), requiresPrescription: true },
      { name: 'Digene Tablets', category: 'Tablet', price: 12, stock: 500, manufacturer: 'Abbott', description: 'Antacid for gas/acidity', expiryDate: new Date('2026-06-15'), requiresPrescription: false },
      { name: 'Dolo 650', category: 'Tablet', price: 30, stock: 250, manufacturer: 'Micro Labs', description: 'Fever and pain relief', expiryDate: new Date('2026-10-10'), requiresPrescription: false },
      { name: 'B-Complex Syrup', category: 'Syrup', price: 80, stock: 60, manufacturer: 'Alkem', description: 'Vitamin B supplement', expiryDate: new Date('2025-09-01'), requiresPrescription: false },
      { name: 'Loperamide 2mg', category: 'Tablet', price: 10, stock: 100, manufacturer: 'Cipla', description: 'Anti-diarrheal', expiryDate: new Date('2026-04-20'), requiresPrescription: false },
      { name: 'Eye Drops (Refresh)', category: 'Other', price: 140, stock: 20, manufacturer: 'Allergan', description: 'Lubricant eye drops', expiryDate: new Date('2025-07-12'), requiresPrescription: false },
      { name: 'Multivitamin (A-Z)', category: 'Tablet', price: 180, stock: 40, manufacturer: 'Alkem', description: 'General wellness', expiryDate: new Date('2026-03-30'), requiresPrescription: false },
      { name: 'Albendazole 400mg', category: 'Tablet', price: 18, stock: 90, manufacturer: 'Glaxo', description: 'Deworming treatment', expiryDate: new Date('2026-11-22'), requiresPrescription: false }
    ];

    const createdMedicines = await Medicine.insertMany(
      medicinesData.map(m => ({ ...m, pharmacy: pharmacyUser._id }))
    );
    console.log(`Inserted ${createdMedicines.length} medicines.`);

    // 2. SEED 30 ORDERS (varied dates and statuses)
    const statuses = ['pending', 'accepted', 'preparing', 'out-for-delivery', 'delivered'];
    const patientNames = ['Rahul Kumar', 'Priya Singh', 'Amit Sharma', 'Sita Devi', 'Vikram Singh', 'Anjali Gupta', 'Deepak Verma', 'Kiran Patel'];
    const addresses = ['House 42, Village Rampur', 'Gali 5, Sector 2, Rampur', 'Near Primary School, Pipra', 'Main Road, Rampur', 'Village Colony, Pipra'];

    const ordersData = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (i % 30)); // Spread over last 30 days
      
      const numItems = Math.floor(Math.random() * 3) + 1;
      const orderItems = [];
      let total = 0;
      
      for (let j = 0; j < numItems; j++) {
        const med = createdMedicines[Math.floor(Math.random() * createdMedicines.length)];
        const qty = Math.floor(Math.random() * 3) + 1;
        orderItems.push({
          medicineId: med._id,
          name: med.name,
          quantity: qty,
          price: med.price
        });
        total += med.price * qty;
      }

      ordersData.push({
        patientId: patientUser._id,
        pharmacyId: pharmacyUser._id,
        items: orderItems,
        totalAmount: total,
        status: i < 5 ? statuses[i] : (Math.random() > 0.8 ? 'pending' : 'delivered'), // Ensure some pending/preparing
        deliveryAddress: addresses[Math.floor(Math.random() * addresses.length)],
        patientName: patientNames[Math.floor(Math.random() * patientNames.length)],
        patientPhone: '98765432' + (10 + i),
        trackingId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        createdAt: date,
        paymentStatus: Math.random() > 0.2 ? 'completed' : 'pending'
      });
    }

    await MedicineOrder.insertMany(ordersData);
    console.log(`Inserted ${ordersData.length} orders.`);

    console.log('Advanced Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during advanced seeding:', err);
    process.exit(1);
  }
};

seedAdvancedData();
