// src/Auth.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

const Auth = ({ onLogin, isDarkMode }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            onLogin(); // Callback to parent component to update user state
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-dark';
    const btnClass = isDarkMode ? 'btn-outline-light' : 'btn-outline-primary';

    return (
        <div className={`p-5 rounded-4 shadow-lg mx-auto ${isDarkMode ? 'glassmorphism-dark' : 'glassmorphism'}`} style={{ maxWidth: '500px' }}>
            <h4 className={`fw-bold text-center mb-4 ${isDarkMode ? 'text-white' : 'text-dark'}`}>
                {isLogin ? 'Login to Your Account' : 'Create an Account'}
            </h4>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleAuth}>
                <div className="mb-3">
                    <label className={`form-label ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email address</label>
                    <input
                        type="email"
                        className={`form-control border-0 ${inputClass}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className={`form-label ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Password</label>
                    <input
                        type="password"
                        className={`form-control border-0 ${inputClass}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className={`btn ${btnClass} w-100 fw-semibold`} disabled={loading}>
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                </button>
            </form>
            <div className={`mt-3 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                    className={`btn btn-link p-0 fw-semibold ${isDarkMode ? 'text-white' : 'text-primary'}`}
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? 'Register' : 'Login'}
                </button>
            </div>
        </div>
    );
};

export default Auth;