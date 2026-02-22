const express = require("express");
const router = express.Router();
const User = require("../models/User");

// -----------------------------
// Create User (After Login)
// -----------------------------
router.post("/create", async (req, res) => {
    try {
        const { authId, username, email } = req.body;

        // Check if already exists
        const existing = await User.findOne({ authId });
        if (existing) {
            return res.json(existing);
        }

        const user = new User({
            authId,
            username,
            email,
        });

        await user.save();

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------
// Get Profile
// -----------------------------
router.get("/:authId", async (req, res) => {
    try {
        const user = await User.findOne({
            authId: req.params.authId,
        }).populate("favorites ratedBooks.bookId");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------
// Update Profile
// -----------------------------
router.put("/:authId", async (req, res) => {
    try {
        const updates = req.body;

        const user = await User.findOneAndUpdate(
            { authId: req.params.authId },
            updates,
            { new: true }
        );

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;