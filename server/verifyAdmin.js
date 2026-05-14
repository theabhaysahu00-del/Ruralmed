const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const verifyAdmin = async () => {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const adminEmail = 'phantomtechies@gmail.com';
    const admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin User Found:');
      console.log('ID:', admin._id);
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('Status:', admin.approvalStatus);
    } else {
      console.log('Admin User NOT Found');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

verifyAdmin();
