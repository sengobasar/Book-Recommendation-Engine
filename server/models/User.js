const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // Firebase / Auth ID
    authId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    avatar: {
      type: String, // URL
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    location: String,

    age: Number,

    // Books user has rated
    ratedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },
        rating: Number,
        review: String,
      },
    ],

    // Favorites / Wishlist
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    timestamps: true, // createdAt + updatedAt
    collection: "users",
  }
);

module.exports = mongoose.model("User", UserSchema);