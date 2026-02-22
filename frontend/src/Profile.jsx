import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // TEMP (later comes from Firebase)
    const authId = "test123";

    useEffect(() => {
        fetch(`${API}/api/users/${authId}`)
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const saveProfile = async () => {
        await fetch(`${API}/api/users/${authId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        alert("Profile Updated ✅");
    };

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div className="max-w-xl mx-auto p-6 mt-10 bg-white dark:bg-gray-900 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-4">My Profile</h2>

            <div className="space-y-4">

                <input
                    className="w-full p-2 border rounded"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    placeholder="Username"
                />

                <input
                    className="w-full p-2 border rounded"
                    name="email"
                    value={user.email}
                    disabled
                />

                <input
                    className="w-full p-2 border rounded"
                    name="location"
                    value={user.location || ""}
                    onChange={handleChange}
                    placeholder="Location"
                />

                <input
                    className="w-full p-2 border rounded"
                    name="age"
                    value={user.age || ""}
                    onChange={handleChange}
                    placeholder="Age"
                />

                <textarea
                    className="w-full p-2 border rounded"
                    name="bio"
                    value={user.bio || ""}
                    onChange={handleChange}
                    placeholder="About me..."
                />

                <button
                    onClick={saveProfile}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Save Profile
                </button>

            </div>
        </div>
    );
}