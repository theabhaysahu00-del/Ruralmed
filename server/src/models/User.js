const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'pharmacy', 'admin'], default: 'patient' },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  verificationStage: { type: String, enum: ['submitted', 'under_review', 'approved', 'rejected'], default: 'submitted' },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  village: { type: String, default: '' },
  language: { type: String, enum: ['en', 'hi'], default: 'en' },
  isDeleted: { type: Boolean, default: false },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
  // Doctor specific fields
  specialization: { type: String },
  clinicName: { type: String },
  experience: { type: String },
  licenseNumber: { type: String },
  medicalLicenseFile: { type: String },
  hospital: { type: String },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
