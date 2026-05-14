const mongoose = require('mongoose');
const User = require('./src/models/User');
const Medicine = require('./src/models/Medicine');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ruralmed';

const checkPharmacies = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const users = await User.find({ role: 'pharmacy' });
    console.log(`Found ${users.length} pharmacy users:`);
    
    for (let u of users) {
      const medCount = await Medicine.countDocuments({ pharmacy: u._id });
      console.log(`- ID: ${u._id}, Name: "${u.name}", Email: "${u.email}", Medicines: ${medCount}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
checkPharmacies();
