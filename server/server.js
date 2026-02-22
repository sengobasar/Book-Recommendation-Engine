const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookrec';
const PORT = process.env.PORT || 5000;

// -----------------------------
// Models
// -----------------------------
const Book = require('./models/Book');
const Rating = require('./models/Rating');
const User = require('./models/User');


// -----------------------------
// Load Collaborative Recommendations
// -----------------------------
const collabPath = path.join(__dirname, 'data', 'collab_recs.json');

if (fs.existsSync(collabPath)) {
  try {
    app.locals.collabMap = JSON.parse(
      fs.readFileSync(collabPath, 'utf8')
    );
    console.log('✅ Loaded collaborative recommendations from', collabPath);
  } catch (err) {
    console.warn('⚠️ Failed to parse collab_recs.json:', err.message);
  }
} else {
  console.log('⚠️ No collaborative recommendations file found. Run precompute exporter.');
}

// -----------------------------
// Routes
// -----------------------------
const recommendations = require('./routes/recommendations');
const userRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');

// Recommendation routes
app.use('/api/recommendations', recommendations);
app.use('/recommendations', recommendations);

// User routes
app.use('/api/users', userRoutes);
app.use('/users', userRoutes);
// Post routes
app.use('/api/posts', postsRoutes);
app.use('/posts', postsRoutes);

// -----------------------------
// Basic Routes
// -----------------------------
app.get('/', (req, res) => {
  res.json({
    message: 'Book Recommendation MERN server',
    status: 'ok'
  });
});

const healthHandler = async (req, res) => {
  try {
    const booksCount = await Book.countDocuments();
    const ratingsCount = await Rating.countDocuments();
    const usersCount = await User.countDocuments();

    res.json({
      status: 'healthy',
      books: booksCount,
      ratings: ratingsCount,
      users: usersCount,
      collaborative_ready: !!app.locals.collabMap
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// -----------------------------
// MongoDB Connection
// -----------------------------
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });