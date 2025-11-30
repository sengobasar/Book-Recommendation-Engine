const express = require('express');
const router = express.Router();
const stringSimilarity = require('string-similarity');

const Book = require('../models/Book');
const Rating = require('../models/Rating');

// GET /api/recommendations/popular
router.get('/popular', async (req, res) => {
  try {
    const pipeline = [
      { $group: { _id: '$isbn', num_ratings: { $sum: 1 }, avg_ratings: { $avg: '$bookRating' } } },
      { $sort: { num_ratings: -1 } },
      { $limit: 50 },
      { $lookup: { from: 'books', localField: '_id', foreignField: 'isbn', as: 'book' } },
      { $unwind: '$book' },
      { $project: { _id: 0, isbn: '$_id', title: '$book.title', author: '$book.author', imageUrlM: '$book.imageUrlM', num_ratings: 1, avg_ratings: 1 } }
    ];
    const results = await Rating.aggregate(pipeline).exec();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/recommendations/collaborative?book_title=...
router.get('/collaborative', async (req, res) => {
  const { book_title } = req.query;
  if (!book_title) return res.status(400).json({ error: 'book_title query param required' });

  const collabMap = req.app.locals.collabMap;
  if (!collabMap) return res.status(500).json({ error: 'Collaborative data not available. Run precompute exporter.' });

  // Find closest matching title key
  const titles = Object.keys(collabMap);
  const match = stringSimilarity.findBestMatch(book_title, titles);
  const best = match.bestMatch;
  if (best.rating < 0.2) return res.status(404).json({ error: `No close match for '${book_title}'` });

  const closest = best.target;
  const similarTitles = collabMap[closest] || [];

  // Lookup book docs for each similar title
  try {
    const recDocs = [];
    for (const t of similarTitles) {
      const doc = await Book.findOne({ title: t }).lean().exec();
      if (doc) {
        recDocs.push({ title: doc.title, author: doc.author, imageUrlM: doc.imageUrlM });
      }
    }
    res.json(recDocs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
