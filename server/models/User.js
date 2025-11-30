const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: Number, index: true, required: true },
  location: String,
  age: Number
}, { collection: 'users' });

module.exports = mongoose.model('User', UserSchema);
