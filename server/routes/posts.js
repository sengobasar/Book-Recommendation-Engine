const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

// -----------------------------
// Create Post
// -----------------------------
router.post("/", async (req, res) => {
    try {
        const { authId, title, content } = req.body;

        const user = await User.findOne({ authId });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const post = new Post({
            author: user._id,
            title,
            content,
        });

        await post.save();

        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------
// Get All Posts
// -----------------------------
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "username")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------
// Add Comment
// -----------------------------
router.post("/:postId/comment", async (req, res) => {
    try {
        const { authId, content } = req.body;

        const user = await User.findOne({ authId });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const comment = new Comment({
            postId: req.params.postId,
            author: user._id,
            content,
        });

        await comment.save();

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------
// Get Comments for Post
// -----------------------------
router.get("/:postId/comments", async (req, res) => {
    try {
        const comments = await Comment.find({
            postId: req.params.postId,
        }).populate("author", "username");

        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;