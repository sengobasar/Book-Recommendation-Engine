const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const Book = require('../models/Book');
const Rating = require('../models/Rating');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookrec';

async function connect() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

function importCSV(filePath, onRow, onEnd) {
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', onRow)
    .on('end', onEnd);
}

async function importBooks() {
  const file = path.join(__dirname, '..', '..', 'Books.csv');
  console.log('Importing books from', file);
  let bulk = [];
  await new Promise((resolve) => {
    importCSV(file, (row) => {
      // Map CSV columns to schema
      bulk.push({
        isbn: row.ISBN,
        title: row['Book-Title'],
        author: row['Book-Author'],
        yearOfPublication: row['Year-Of-Publication'],
        publisher: row.Publisher,
        imageUrlS: row['Image-URL-S'],
        imageUrlM: row['Image-URL-M'],
        imageUrlL: row['Image-URL-L']
      });
      if (bulk.length >= 500) {
        Book.insertMany(bulk, { ordered: false }).catch(()=>{});
        bulk = [];
      }
    }, async () => {
      if (bulk.length) await Book.insertMany(bulk, { ordered: false }).catch(()=>{});
      resolve();
    });
  });
}

async function importRatings() {
  const file = path.join(__dirname, '..', '..', 'Ratings.csv');
  console.log('Importing ratings from', file);
  let bulk = [];
  await new Promise((resolve) => {
    importCSV(file, (row) => {
      bulk.push({
        userId: Number(row['User-ID']),
        isbn: row.ISBN,
        bookRating: Number(row['Book-Rating'])
      });
      if (bulk.length >= 500) {
        Rating.insertMany(bulk, { ordered: false }).catch(()=>{});
        bulk = [];
      }
    }, async () => {
      if (bulk.length) await Rating.insertMany(bulk, { ordered: false }).catch(()=>{});
      resolve();
    });
  });
}

async function importUsers() {
  const file = path.join(__dirname, '..', '..', 'Users.csv');
  console.log('Importing users from', file);
  let bulk = [];
  await new Promise((resolve) => {
    importCSV(file, (row) => {
      bulk.push({
        userId: Number(row['User-ID']),
        location: row.Location,
        age: row.Age ? Number(row.Age) : null
      });
      if (bulk.length >= 500) {
        User.insertMany(bulk, { ordered: false }).catch(()=>{});
        bulk = [];
      }
    }, async () => {
      if (bulk.length) await User.insertMany(bulk, { ordered: false }).catch(()=>{});
      resolve();
    });
  });
}

async function run() {
  console.log('Connecting to MongoDB...');
  await connect();
  console.log('Dropping existing collections (books, ratings, users) if present');
  try { await Book.collection.drop(); } catch(e){}
  try { await Rating.collection.drop(); } catch(e){}
  try { await require('../models/User').collection.drop(); } catch(e){}

  await importBooks();
  await importRatings();
  await importUsers();
  console.log('Import complete.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
