const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: emailRegex },
  mobileNumber: { type: String, required: true },
  password: { type: String, required: true },
  userRole: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);

