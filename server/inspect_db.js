const mongoose = require('mongoose');
require('dotenv').config();

const Book = require('./models/Book');
const Rating = require('./models/Rating');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookrec';

async function inspect() {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('✅ Connected to MongoDB\n');

        const bookCount = await Book.countDocuments();
        const ratingCount = await Rating.countDocuments();
        const userCount = await User.countDocuments();

        console.log(`📚 Books: ${bookCount}`);
        console.log(`⭐ Ratings: ${ratingCount}`);
        console.log(`👤 Users: ${userCount}\n`);

        console.log('--- Sample Book ---');
        console.log(await Book.findOne().lean());
        console.log('\n--- Sample Rating ---');
        console.log(await Rating.findOne().lean());
        console.log('\n--- Sample User ---');
        console.log(await User.findOne().lean());

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
}

inspect();
