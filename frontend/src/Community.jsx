import React, { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/posts`;

export default function Community({ isDarkMode }) {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const authId = localStorage.getItem("authId");

    // -----------------------------
    // Fetch All Posts
    // -----------------------------
    const loadPosts = async () => {
        try {
            setLoading(true);

            const res = await fetch(API_URL);
            const data = await res.json();

            setPosts(data);
            setError("");
        } catch (err) {
            setError("Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // Load on Start
    // -----------------------------
    useEffect(() => {
        loadPosts();
    }, []);

    // -----------------------------
    // Create New Post
    // -----------------------------
    const submitPost = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            return;
        }

        try {
            setLoading(true);

            await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    authId,
                    title,
                    content,
                }),
            });

            setTitle("");
            setContent("");

            loadPosts();
        } catch (err) {
            setError("Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    const cardClass = isDarkMode
        ? "bg-dark text-white border-secondary"
        : "bg-white text-dark";

    // -----------------------------
    // UI
    // -----------------------------
    return (
        <div className="container py-4">

            {/* Header */}
            <div className="text-center mb-4">
                <h2 className="fw-bold">Community Forum</h2>
                <p className="text-muted">
                    Share ideas, reviews, and discussions
                </p>
            </div>

            {/* Create Post */}
            <div className={`card shadow mb-4 ${cardClass}`}>
                <div className="card-body">

                    <h5 className="fw-bold mb-3">Create Post</h5>

                    <form onSubmit={submitPost}>

                        <input
                            className="form-control mb-2"
                            placeholder="Post Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <textarea
                            className="form-control mb-3"
                            rows="3"
                            placeholder="Write your thoughts..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? "Posting..." : "Post"}
                        </button>

                    </form>

                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-danger text-center">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center mb-3">
                    Loading...
                </div>
            )}

            {/* Posts List */}
            {posts.length === 0 && !loading && (
                <div className="text-center text-muted">
                    No posts yet. Be the first one 🚀
                </div>
            )}

            {posts.map((post) => (
                <div
                    key={post._id}
                    className={`card shadow mb-3 ${cardClass}`}
                >
                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-2">

                            <h5 className="fw-bold mb-0">
                                {post.title}
                            </h5>

                            <small className="text-muted">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </small>

                        </div>

                        <p className="mb-2">
                            {post.content}
                        </p>

                        <div className="small text-muted">
                            Posted by:{" "}
                            <span className="fw-semibold">
                                {post.author?.username || "User"}
                            </span>
                        </div>

                    </div>
                </div>
            ))}

        </div>
    );
}