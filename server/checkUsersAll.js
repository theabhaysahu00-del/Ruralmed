const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ruralmed';

const checkUsersAll = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const users = await User.find({ email: 'devendar@gmail.com' });
    console.log(`Found ${users.length} users with devendar@gmail.com:`);
    users.forEach(u => {
      console.log(`- ID: ${u._id}, Name: ${u.name}, Role: ${u.role}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
checkUsersAll();
