const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('./src/models/Medicine');
const MedicineOrder = require('./src/models/MedicineOrder');
const User = require('./src/models/User');

dotenv.config({ path: './server/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/telemedicine';

const seedDevendarData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for Seeding devendar@gmail.com...');

    let pharmacyUser = await User.findOne({ email: 'devendar@gmail.com', role: 'pharmacy' });

    if (!pharmacyUser) {
      console.log('Pharmacy User devendar@gmail.com not found. Creating it now...');
      pharmacyUser = await User.create({
        name: 'Devendar Pharmacy',
        email: 'devendar@gmail.com',
        password: 'devendar', 
        phone: '9988776655',
        role: 'pharmacy',
        village: 'Rampur'
      });
      console.log('User created successfully.');
    }

    const patientNames = ['Rahul Kumar', 'Priya Singh', 'Amit Sharma', 'Sita Devi', 'Vikram Singh', 'Anjali Gupta', 'Deepak Verma', 'Kiran Patel', 'Rohit Jha', 'Sneha Kapoor', 'Manoj Tiwari', 'Pooja Reddy', 'Suresh Menon', 'Neha Desai', 'Ravi Shastri'];
    const patientUsers = [];

    for (let i = 0; i < patientNames.length; i++) {
      let email = `dummy${i}@patient.com`;
      let pUser = await User.findOne({ email });
      if (!pUser) {
          pUser = await User.create({
              name: patientNames[i],
              email: email,
              password: 'password123',
              phone: `9999999${i.toString().padStart(3, '0')}`,
              role: 'patient',
              village: 'Test Village'
          });
      }
      patientUsers.push(pUser);
    }
    console.log(`Ensured ${patientUsers.length} dummy patients exist.`);

    // Clear existing data for this pharmacy
    await Medicine.deleteMany({ pharmacy: pharmacyUser._id });
    await MedicineOrder.deleteMany({ pharmacyId: pharmacyUser._id });

    // 1. SEED ~55 MEDICINES
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
      { name: 'Albendazole 400mg', category: 'Tablet', price: 18, stock: 90, manufacturer: 'Glaxo', description: 'Deworming treatment', expiryDate: new Date('2026-11-22'), requiresPrescription: false },
      { name: 'Ibuprofen 400mg', category: 'Tablet', price: 25, stock: 140, manufacturer: 'Abbott', description: 'Pain relief and anti-inflammatory', expiryDate: new Date('2025-12-01'), requiresPrescription: false },
      { name: 'Ciprofloxacin 500mg', category: 'Antibiotic', price: 65, stock: 80, manufacturer: 'Bayer', description: 'Broad spectrum antibiotic', expiryDate: new Date('2026-02-15'), requiresPrescription: true },
      { name: 'Ranitidine 150mg', category: 'Tablet', price: 15, stock: 200, manufacturer: 'Cadila', description: 'Reduces stomach acid', expiryDate: new Date('2026-07-10'), requiresPrescription: false },
      { name: 'Aspirin 75mg', category: 'Tablet', price: 12, stock: 350, manufacturer: 'Bayer', description: 'Blood thinner and pain relief', expiryDate: new Date('2027-01-20'), requiresPrescription: false },
      { name: 'Salbutamol Inhaler', category: 'Other', price: 150, stock: 25, manufacturer: 'Cipla', description: 'Asthma relief inhaler', expiryDate: new Date('2025-06-30'), requiresPrescription: true },
      { name: 'Levocetirizine 5mg', category: 'Tablet', price: 30, stock: 110, manufacturer: 'Sun Pharma', description: 'Allergy and hay fever relief', expiryDate: new Date('2026-04-18'), requiresPrescription: false },
      { name: 'Domperidone 10mg', category: 'Tablet', price: 22, stock: 130, manufacturer: 'Torrent', description: 'Anti-nausea medication', expiryDate: new Date('2025-11-11'), requiresPrescription: false },
      { name: 'Clotrimazole Cream', category: 'Ointment', price: 55, stock: 45, manufacturer: 'Glenmark', description: 'Antifungal skin cream', expiryDate: new Date('2026-09-05'), requiresPrescription: false },
      { name: 'Ondansetron 4mg', category: 'Tablet', price: 40, stock: 75, manufacturer: 'Dr. Reddys', description: 'Prevents nausea and vomiting', expiryDate: new Date('2025-10-25'), requiresPrescription: true },
      { name: 'Atorvastatin 10mg', category: 'Tablet', price: 85, stock: 95, manufacturer: 'Lupin', description: 'Cholesterol lowering drug', expiryDate: new Date('2026-08-30'), requiresPrescription: true },
      { name: 'Iron & Folic Acid', category: 'Capsule', price: 110, stock: 85, manufacturer: 'Mankind', description: 'Anemia prevention supplement', expiryDate: new Date('2026-05-15'), requiresPrescription: false },
      { name: 'Montelukast 10mg', category: 'Tablet', price: 120, stock: 40, manufacturer: 'Cipla', description: 'Asthma and allergy prevention', expiryDate: new Date('2025-12-10'), requiresPrescription: true },
      { name: 'Calcium + Vit D3', category: 'Tablet', price: 95, stock: 160, manufacturer: 'Shelcal', description: 'Bone density supplement', expiryDate: new Date('2027-02-28'), requiresPrescription: false },
      { name: 'Loratadine 10mg', category: 'Tablet', price: 45, stock: 65, manufacturer: 'Zydus', description: 'Non-drowsy allergy relief', expiryDate: new Date('2026-01-20'), requiresPrescription: false },
      { name: 'Ketoconazole Soap', category: 'Other', price: 85, stock: 30, manufacturer: 'Johnson', description: 'Antifungal medicated soap', expiryDate: new Date('2025-08-05'), requiresPrescription: false },
      { name: 'Mefenamic Acid', category: 'Tablet', price: 35, stock: 120, manufacturer: 'Blue Cross', description: 'Menstrual pain relief', expiryDate: new Date('2026-03-12'), requiresPrescription: false },
      { name: 'Zincovit Tablet', category: 'Tablet', price: 105, stock: 150, manufacturer: 'Apex', description: 'Multivitamin with Zinc', expiryDate: new Date('2026-07-25'), requiresPrescription: false },
      { name: 'Betadine Ointment', category: 'Ointment', price: 110, stock: 55, manufacturer: 'Win-Medicare', description: 'Antiseptic for wounds', expiryDate: new Date('2026-10-30'), requiresPrescription: false },
      { name: 'Thyroxine 50mcg', category: 'Tablet', price: 130, stock: 85, manufacturer: 'Abbott', description: 'Thyroid hormone replacement', expiryDate: new Date('2025-09-18'), requiresPrescription: true },
      { name: 'Losartan 50mg', category: 'Tablet', price: 75, stock: 90, manufacturer: 'Torrent', description: 'High blood pressure medication', expiryDate: new Date('2026-11-15'), requiresPrescription: true },
      { name: 'Glimepiride 1mg', category: 'Tablet', price: 55, stock: 105, manufacturer: 'Sanofi', description: 'Type 2 diabetes medication', expiryDate: new Date('2026-06-20'), requiresPrescription: true },
      { name: 'Probiotic Capsules', category: 'Capsule', price: 160, stock: 45, manufacturer: 'Dr. Reddys', description: 'Gut health supplement', expiryDate: new Date('2025-07-25'), requiresPrescription: false },
      { name: 'Cefixime 200mg', category: 'Antibiotic', price: 115, stock: 60, manufacturer: 'Alkem', description: 'Cephalosporin antibiotic', expiryDate: new Date('2026-01-05'), requiresPrescription: true },
      { name: 'Dicyclomine 20mg', category: 'Tablet', price: 25, stock: 140, manufacturer: 'Indoco', description: 'Abdominal pain and cramps', expiryDate: new Date('2026-04-10'), requiresPrescription: false },
      { name: 'Nimesulide 100mg', category: 'Tablet', price: 40, stock: 115, manufacturer: 'Panacea', description: 'NSAID for pain relief', expiryDate: new Date('2026-08-01'), requiresPrescription: true },
      { name: 'Doxofylline 400mg', category: 'Tablet', price: 85, stock: 35, manufacturer: 'Macleods', description: 'Bronchodilator for asthma', expiryDate: new Date('2025-10-15'), requiresPrescription: true },
      { name: 'Fluticasone Nasal Spray', category: 'Other', price: 280, stock: 15, manufacturer: 'GSK', description: 'Allergic rhinitis relief', expiryDate: new Date('2025-12-25'), requiresPrescription: true },
      { name: 'Amlodipine 5mg', category: 'Tablet', price: 30, stock: 180, manufacturer: 'Pfizer', description: 'Blood pressure medication', expiryDate: new Date('2027-03-10'), requiresPrescription: true },
      { name: 'Omeprazole 20mg', category: 'Capsule', price: 45, stock: 125, manufacturer: 'Dr. Reddys', description: 'Acid reflux treatment', expiryDate: new Date('2026-05-05'), requiresPrescription: false },
      { name: 'Sertraline 50mg', category: 'Tablet', price: 95, stock: 40, manufacturer: 'Sun Pharma', description: 'Antidepressant', expiryDate: new Date('2026-02-28'), requiresPrescription: true },
      { name: 'Pregabalin 75mg', category: 'Capsule', price: 140, stock: 55, manufacturer: 'Torrent', description: 'Nerve pain medication', expiryDate: new Date('2026-09-20'), requiresPrescription: true },
      { name: 'Clopidogrel 75mg', category: 'Tablet', price: 80, stock: 70, manufacturer: 'Sanofi', description: 'Prevents blood clots', expiryDate: new Date('2026-11-10'), requiresPrescription: true },
      { name: 'Rabeprazole 20mg', category: 'Tablet', price: 65, stock: 95, manufacturer: 'Lupin', description: 'Gastric ulcer treatment', expiryDate: new Date('2026-07-15'), requiresPrescription: false },
      { name: 'Ascorbic Acid (Vit C)', category: 'Tablet', price: 35, stock: 200, manufacturer: 'Abbott', description: 'Immunity booster', expiryDate: new Date('2027-01-05'), requiresPrescription: false },
      { name: 'Bromhexine Syrup', category: 'Syrup', price: 75, stock: 45, manufacturer: 'Cipla', description: 'Mucus clearance for cough', expiryDate: new Date('2025-08-20'), requiresPrescription: false },
      { name: 'Meloxicam 15mg', category: 'Tablet', price: 55, stock: 65, manufacturer: 'Zydus', description: 'Arthritis pain relief', expiryDate: new Date('2026-10-25'), requiresPrescription: true },
      { name: 'Nitrofurantoin 100mg', category: 'Antibiotic', price: 125, stock: 30, manufacturer: 'Sun Pharma', description: 'UTI antibiotic', expiryDate: new Date('2026-03-15'), requiresPrescription: true }
    ];

    const createdMedicines = await Medicine.insertMany(
      medicinesData.map(m => ({ ...m, pharmacy: pharmacyUser._id }))
    );
    console.log(`Inserted ${createdMedicines.length} medicines for devendar.`);

    // 2. SEED 30 ORDERS (varied dates and statuses)
    const statuses = ['pending', 'accepted', 'preparing', 'out-for-delivery', 'delivered'];
    const addresses = ['House 42, Village Rampur', 'Gali 5, Sector 2, Rampur', 'Near Primary School, Pipra', 'Main Road, Rampur', 'Village Colony, Pipra', 'Market Street, Rampur'];

    const ordersData = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (i % 30)); // Spread over last 30 days
      
      const numItems = Math.floor(Math.random() * 4) + 1;
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

      const selectedPatient = patientUsers[Math.floor(Math.random() * patientUsers.length)];

      ordersData.push({
        patientId: selectedPatient._id,
        pharmacyId: pharmacyUser._id,
        items: orderItems,
        totalAmount: total,
        status: i < 5 ? statuses[i] : (Math.random() > 0.8 ? 'pending' : 'delivered'), // Ensure some pending/preparing
        deliveryAddress: addresses[Math.floor(Math.random() * addresses.length)],
        patientName: selectedPatient.name,
        patientPhone: selectedPatient.phone,
        trackingId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        createdAt: date,
        paymentStatus: Math.random() > 0.2 ? 'completed' : 'pending'
      });
    }

    await MedicineOrder.insertMany(ordersData);
    console.log(`Inserted ${ordersData.length} orders for devendar.`);

    console.log('Seeding completed successfully for devendar@gmail.com!');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
};

seedDevendarData();
