const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  isbn: { type: String, index: true, required: true },
  title: String,
  author: String,
  yearOfPublication: String,
  publisher: String,
  imageUrlS: String,
  imageUrlM: String,
  imageUrlL: String
}, { collection: 'books' });

module.exports = mongoose.model('Book', BookSchema);
