const mongoose = require('mongoose');
const User = require('./src/models/User');
const Medicine = require('./src/models/Medicine');
const MedicineOrder = require('./src/models/MedicineOrder');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ruralmed';

const verify = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const user = await User.findOne({ email: 'devendar@gmail.com' });
    if (!user) {
      console.log('User devendar@gmail.com NOT FOUND');
      process.exit(0);
    }
    console.log(`Found user: ${user.name} (${user.email}), ID: ${user._id}`);
    
    const medCount = await Medicine.countDocuments({ pharmacy: user._id });
    console.log(`Medicines linked to this user: ${medCount}`);
    
    const orderCount = await MedicineOrder.countDocuments({ pharmacyId: user._id });
    console.log(`Orders linked to this user: ${orderCount}`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
verify();
