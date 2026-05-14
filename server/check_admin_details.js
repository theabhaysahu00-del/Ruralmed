require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./src/models/User');

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const u = await User.findOne({ email: 'phantomtechies@gmail.com' });
    console.log("Full User Document:", JSON.stringify(u, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
check();
