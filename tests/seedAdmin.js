const mongoose = require('./server/node_modules/mongoose');
const User = require('./server/src/models/User');
require('dotenv').config({ path: './server/.env' });

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    mongoose.set('bufferCommands', false); // Disable buffering to see immediate errors
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('✅ Connected successfully!');

    const adminEmail = 'phantomtechies@gmail.com';
    const adminPassword = 'Phantom@2027';

    console.log('Checking if admin exists...');
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('ℹ️ Admin already exists. Updating password...');
      existingAdmin.password = adminPassword;
      existingAdmin.role = 'admin';
      existingAdmin.approvalStatus = 'approved';
      await existingAdmin.save();
      console.log('✅ Admin password updated successfully.');
    } else {
      console.log('🚀 Creating new Admin user...');
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        phone: '9999999999',
        role: 'admin',
        approvalStatus: 'approved'
      });
      console.log('✅ Admin created successfully.');
    }

    console.log('Seeding finished.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
};

seedAdmin();
