require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./src/models/User');

const check = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not found");
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ role: 'admin' });
    console.log("Admin Users in DB:");
    for (let u of users) {
      console.log(`- Email: ${u.email}, Password Hash: ${u.password}`);
      const isMatch = await u.comparePassword('Phantom@2027');
      console.log(`  Matches 'Phantom@2027': ${isMatch}`);
      const isMatch2 = await u.comparePassword('secureAdmin123');
      console.log(`  Matches 'secureAdmin123': ${isMatch2}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
check();
