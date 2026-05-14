const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ruralmed';

const checkUsersByName = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const users = await User.find({ name: { $regex: /devendar/i } });
    console.log(`Found ${users.length} users with name like devendar:`);
    users.forEach(u => {
      console.log(`- ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
checkUsersByName();
