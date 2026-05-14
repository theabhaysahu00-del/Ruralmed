const User = require('../models/User');
const logger = require('./logger');

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ruralmed.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'secureAdmin123',
        phone: '0000000000',
        role: 'admin',
        isActive: true
      });
      logger.info(`Admin user created: ${adminEmail}`);
    } else {
      logger.info('Admin user already exists');
    }
  } catch (error) {
    logger.error(`Error seeding admin: ${error.message}`);
  }
};

module.exports = seedAdmin;
