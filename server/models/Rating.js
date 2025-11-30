const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  userId: { type: Number, index: true },
  isbn: { type: String, index: true },
  bookRating: { type: Number }
}, { collection: 'ratings' });

module.exports = mongoose.model('Rating', RatingSchema);
