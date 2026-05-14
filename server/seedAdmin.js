const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('MONGO_URI is not defined in .env');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'phantomtechies@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Phantom@2027';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists. Updating password...');
      existingAdmin.password = adminPassword;
      existingAdmin.role = 'admin';
      existingAdmin.approvalStatus = 'approved';
      await existingAdmin.save();
      console.log('Admin password updated successfully.');
    } else {
      console.log('Creating new Admin...');
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        phone: '9999999999',
        role: 'admin',
        approvalStatus: 'approved'
      });
      console.log('Admin created successfully.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();
