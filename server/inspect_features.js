const mongoose = require('mongoose');
require('dotenv').config();

const Book = require('./models/Book');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookrec';

async function analyzeFeatures() {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('✅ Connected. Analyzing 270k+ Books...\n');

        // 1. Get a random sample to see all possible keys
        const sample = await Book.findOne().lean();
        console.log('--- ALL AVAILABLE FEATURES (From a single record) ---');
        Object.keys(sample).forEach(key => console.log(`- ${key}: ${typeof sample[key]} (e.g. "${sample[key]}")`));

        // 2. Aggregation for insights
        console.log('\n--- DATA INSIGHTS ---');

        // Years range
        const years = await Book.distinct('yearOfPublication');
        const validYears = years.filter(y => !isNaN(y) && y > 1800 && y < 2026).sort();
        console.log(`Year Range: ${validYears[0]} - ${validYears[validYears.length - 1]}`);

        // Top Publishers
        const topPublishers = await Book.aggregate([
            { $group: { _id: "$publisher", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        console.log('\nTop 5 Publishers:');
        topPublishers.forEach(p => console.log(`- ${p._id}: ${p.count} books`));

        // Top Authors
        const topAuthors = await Book.aggregate([
            { $group: { _id: "$author", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        console.log('\nTop 5 Authors:');
        topAuthors.forEach(a => console.log(`- ${a._id}: ${a.count} books`));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
}

analyzeFeatures();
