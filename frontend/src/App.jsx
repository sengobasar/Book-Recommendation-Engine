import { useState, useEffect, useRef } from "react";

// API Base
const API = "http://localhost:5000";

// ---------------- ICONS ----------------

const Search = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={className}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const Users = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
    </svg>
);

const Star = ({ filled }) => (
    <svg width="16" height="16" fill={filled ? "gold" : "none"}
        stroke="gold" strokeWidth="2">
        <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" />
    </svg>
);

// ---------------- PROFILE PAGE ----------------

function ProfilePage({ goHome }) {

    const [user, setUser] = useState(null);
    const authId = "test123";

    useEffect(() => {
        fetch(`${API}/api/users/${authId}`)
            .then(res => res.json())
            .then(data => setUser(data));
    }, []);

    if (!user) return <p className="text-white p-5">Loading...</p>;

    const save = async () => {

        await fetch(`${API}/api/users/${authId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        alert("Saved ✅");
    };

    return (
        <div className="min-vh-100 bg-dark text-white p-5">

            <button
                onClick={goHome}
                className="btn btn-outline-light mb-4"
            >
                ← Back
            </button>

            <div className="container col-md-6">

                <h2 className="mb-4">My Profile</h2>

                <input
                    className="form-control mb-3"
                    value={user.username}
                    onChange={e => setUser({ ...user, username: e.target.value })}
                />

                <input
                    className="form-control mb-3"
                    value={user.email}
                    disabled
                />

                <input
                    className="form-control mb-3"
                    placeholder="Location"
                    value={user.location || ""}
                    onChange={e => setUser({ ...user, location: e.target.value })}
                />

                <textarea
                    className="form-control mb-3"
                    placeholder="Bio"
                    value={user.bio || ""}
                    onChange={e => setUser({ ...user, bio: e.target.value })}
                />

                <button
                    onClick={save}
                    className="btn btn-primary w-100"
                >
                    Save Profile
                </button>

            </div>
        </div>
    );
}

// ---------------- MAIN APP ----------------

export default function App() {

    const [page, setPage] = useState("home");

    const [activeTab, setActiveTab] = useState("popular");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("Harry Potter");

    // Fetch Books
    const fetchBooks = async () => {

        setLoading(true);

        let url = "/api/recommendations/popular";

        if (activeTab === "collaborative") {
            url = `/api/recommendations/collaborative?book_title=${search}`;
        }

        const res = await fetch(API + url);
        const data = await res.json();

        setBooks(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchBooks();
    }, [activeTab]);

    // ---------------- PROFILE PAGE ----------------

    if (page === "profile") {
        return <ProfilePage goHome={() => setPage("home")} />;
    }

    // ---------------- HOME PAGE ----------------

    return (
        <div className="min-vh-100 bg-dark text-white">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center p-4">

                <h2>📚 BookAI</h2>

                <button
                    onClick={() => setPage("profile")}
                    className="btn btn-outline-light"
                >
                    Profile
                </button>

            </div>

            {/* TABS */}
            <div className="d-flex justify-content-center gap-3 mb-4">

                {["popular", "collaborative"].map(t => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`btn ${activeTab === t ? "btn-primary" : "btn-outline-light"}`}
                    >
                        {t}
                    </button>
                ))}

            </div>

            {/* SEARCH */}
            {activeTab === "collaborative" && (

                <div className="container mb-4">

                    <div className="input-group">

                        <input
                            className="form-control"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />

                        <button
                            onClick={fetchBooks}
                            className="btn btn-primary"
                        >
                            <Search />
                        </button>

                    </div>

                </div>
            )}

            {/* BOOKS */}
            <div className="container">

                {loading && <p>Loading...</p>}

                <div className="row g-4">

                    {books.map((b, i) => (

                        <div key={i} className="col-md-3">

                            <div className="card bg-secondary text-white h-100 p-3">

                                <h6>{b["Book-Title"] || b.title}</h6>

                                <small>{b["Book-Author"] || b.author}</small>

                                <div className="mt-2 d-flex">
                                    {[1, 2, 3, 4, 5].map(n =>
                                        <Star key={n} filled={n <= (b.avg_ratings || 0)} />
                                    )}
                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}