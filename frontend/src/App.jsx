import { useState, useEffect, useRef } from 'react';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Enhanced Icons with micro-animations
const Search = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform hover:scale-110 ${className}`}>
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
    </svg>
);

const Book = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform hover:scale-110 ${className}`}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
);

const Users = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform hover:scale-110 ${className}`}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);

const Star = ({ filled, className = "" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill={filled ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={`transition-all duration-300 hover:scale-125 ${className}`}
    >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
);

const Sun = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform hover:rotate-90 duration-300 ${className}`}>
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2"/>
        <path d="M12 20v2"/>
        <path d="M4.93 4.93l1.41 1.41"/>
        <path d="M17.66 17.66l1.41 1.41"/>
        <path d="M2 12h2"/>
        <path d="M20 12h2"/>
        <path d="M4.93 19.07l1.41-1.41"/>
        <path d="M17.66 6.34l1.41-1.41"/>
    </svg>
);

const Moon = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform hover:-rotate-12 duration-300 ${className}`}>
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>
    </svg>
);

const TrendingUp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
        <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
        <polyline points="16,7 22,7 22,13"/>
    </svg>
);

// Floating Particles Component
const FloatingParticles = ({ isDarkMode, count = 20 }) => {
    const particles = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
    }));

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className={`absolute rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-300'} opacity-20`}
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animation: `float-particle ${particle.duration}s ease-in-out infinite ${particle.delay}s alternate`,
                    }}
                />
            ))}
        </div>
    );
};

// Enhanced Loading Component
const LoadingSpinner = ({ isDarkMode }) => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center p-5">
            <div className="position-relative">
                <div className={`spinner-border ${isDarkMode ? 'text-primary' : 'text-info'}`} role="status" style={{ width: '4rem', height: '4rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="position-absolute top-50 start-50 translate-middle">
                    <Book className="text-muted" />
                </div>
            </div>
            <div className="mt-4 text-center">
                <div className={`fw-semibold ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                    Curating Recommendations
                </div>
                <div className={`small ${isDarkMode ? 'text-secondary' : 'text-muted'} mt-1`}>
                    Our AI is analyzing thousands of books...
                </div>
            </div>
        </div>
    );
};

// Enhanced Book Card Component
const BookCard = ({ book, isDarkMode, index }) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);
    
    useEffect(() => {
        if (cardRef.current) {
            cardRef.current.style.animationDelay = `${index * 0.1}s`;
        }
    }, [index]);
    
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star key={i} filled={i < fullStars || (i === fullStars && hasHalfStar)} />
            );
        }
        return stars;
    };

    const cardBgClass = isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-dark border-gray-200';

    return (
        <div 
            ref={cardRef}
            className={`card h-100 ${cardBgClass} border-0 shadow-lg rounded-4 overflow-hidden position-relative transition-all duration-300 hover:shadow-2xl animate-fade-in-up`}
            style={{
                transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gradient overlay for premium feel */}
            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-0 transition-opacity duration-300 hover:opacity-10 bg-gradient-to-br from-blue-500 to-purple-600 pointer-events-none" />
            
            <div className="position-relative overflow-hidden rounded-top-4">
                {!imageError ? (
                    <img 
                        src={book['Image-URL-M'] || book.imageUrl} 
                        alt={book['Book-Title'] || book.title}
                        className="card-img-top w-100 object-fit-cover rounded-top-4 transition-transform duration-500"
                        style={{ 
                            height: '320px',
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        }}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className={`d-flex align-items-center justify-content-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} text-gray-500 rounded-top-4`} style={{ height: '320px' }}>
                        <div className="text-center">
                            <Book className="w-16 h-16 mb-2" />
                            <span className="d-block fw-medium">No Image Available</span>
                        </div>
                    </div>
                )}
                
                {/* Floating rating badge */}
                <div className="position-absolute top-3 end-3">
                    <div className={`badge ${isDarkMode ? 'bg-dark' : 'bg-white'} bg-opacity-90 px-3 py-2 rounded-pill fw-bold`}>
                        <div className="d-flex align-items-center">
                            <Star filled={true} className="text-warning me-1" />
                            <span className="small">{(book.avg_ratings || book.rating || 0).toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="card-body d-flex flex-column p-4">
                <h5 className={`card-title fw-bold mb-2 lh-sm ${isDarkMode ? 'text-light' : 'text-dark'}`} style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>
                    {book['Book-Title'] || book.title}
                </h5>
                
                <p className={`card-subtitle fst-italic mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>
                    by {book['Book-Author'] || book.author}
                </p>
                
                <div className="mt-auto">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center text-warning">
                            {renderStars(book.avg_ratings || book.rating || 0)}
                        </div>
                        <div className={`small fw-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {(book.num_ratings || book.ratings || 0).toLocaleString()} reviews
                        </div>
                    </div>
                    
                    {/* Interactive hover button */}
                    <button className={`btn w-100 rounded-pill py-2 fw-semibold transition-all duration-300 ${
                        isDarkMode 
                            ? 'btn-outline-light hover:bg-white hover:text-dark' 
                            : 'btn-outline-primary hover:bg-primary hover:text-white'
                    }`}>
                        <span className="d-inline-flex align-items-center">
                            View Details
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ms-2 transition-transform group-hover:translate-x-1">
                                <path d="M5 12h14"/>
                                <path d="m12 5 7 7-7 7"/>
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Stats Counter Component
const StatsCounter = ({ value, label, icon, isDarkMode }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        
        return () => clearInterval(timer);
    }, [value]);
    
    return (
        <div className="text-center">
            <div className="mb-2">{icon}</div>
            <div className={`display-6 fw-bold ${isDarkMode ? 'text-white' : 'text-dark'}`}>
                {count.toLocaleString()}
            </div>
            <div className={`small ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {label}
            </div>
        </div>
    );
};

// Main App Component
export default function App() {
    const [activeTab, setActiveTab] = useState('popular');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [backendStatus, setBackendStatus] = useState('checking');
    const [searchTerm, setSearchTerm] = useState('The Da Vinci Code');
    const [fetchTrigger, setFetchTrigger] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        let retries = 0;
        const maxRetries = 5;
        let delay = 1000;

        while (retries < maxRetries) {
            try {
                let endpoint = '';
                switch (activeTab) {
                    case 'popular':
                        endpoint = '/recommendations/popular';
                        break;
                    case 'collaborative':
                        if (!searchTerm.trim()) {
                            setError("Please enter a book title to get personalized recommendations.");
                            setLoading(false);
                            return;
                        }
                        endpoint = `/recommendations/collaborative?book_title=${encodeURIComponent(searchTerm)}`;
                        break;
                    case 'content':
                        endpoint = '/recommendations/content?book_title=Harry Potter';
                        break;
                    default:
                        endpoint = '/recommendations/popular';
                }

                const response = await fetch(`${API_BASE_URL}${endpoint}`);
                
                if (!response.ok) {
                    if (response.status === 429 || response.status >= 500) {
                        retries++;
                        await new Promise(res => setTimeout(res, delay));
                        delay *= 2;
                        continue;
                    }
                    throw new Error(`Failed to fetch recommendations: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    setBooks(data);
                } else if (data.message) {
                    setBooks([]);
                    setError(data.message);
                } else {
                    setBooks([]);
                    setError('Unexpected response format from server');
                }
                break;
            } catch (err) {
                if (retries === maxRetries - 1) {
                    setError(`Unable to fetch recommendations: ${err.message}. Please try again later.`);
                    setBooks([]);
                    console.error('Fetch error:', err);
                }
                retries++;
                await new Promise(res => setTimeout(res, delay));
                delay *= 2;
            } finally {
                if (retries === maxRetries) {
                    setLoading(false);
                }
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        const checkBackend = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/`);
                if (response.ok) {
                    setBackendStatus('connected');
                } else {
                    setBackendStatus('error');
                }
            } catch (err) {
                setBackendStatus('error');
                console.error('Backend connection failed:', err);
            }
        };
        checkBackend();
    }, []);

    useEffect(() => {
        if (backendStatus === 'connected') {
            fetchBooks();
        }
    }, [activeTab, backendStatus, fetchTrigger]);

    const tabs = [
        { 
            id: 'popular', 
            label: 'Trending', 
            icon: <TrendingUp />, 
            description: 'Most Popular Books',
            subtitle: 'Discover what everyone is reading'
        },
        { 
            id: 'collaborative', 
            label: 'For You', 
            icon: <Users />, 
            description: 'Personalized Recommendations',
            subtitle: 'AI-powered suggestions based on your preferences'
        },
        { 
            id: 'content', 
            label: 'Similar', 
            icon: <Search />, 
            description: 'Content-Based Matches',
            subtitle: 'Find books similar to your favorites'
        }
    ];

    const handleSearch = () => {
        setFetchTrigger(prev => prev + 1);
    };
    
    const appClass = isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-dark';

    return (
        <div className={`min-vh-100 position-relative ${appClass}`}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
                @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');

                * {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                body {
                    font-feature-settings: 'cv01', 'cv02', 'cv03', 'cv04';
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow-x: hidden;
                }

                @keyframes float-particle {
                    0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
                    50% { opacity: 0.8; }
                    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse-glow {
                    0%, 100% {
                        box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
                    }
                    50% {
                        box-shadow: 0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.4);
                    }
                }

                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }

                .animate-pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient-shift 3s ease infinite;
                }

                .glassmorphism {
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .glassmorphism-dark {
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .nav-pills .nav-link {
                    border-radius: 50px;
                    padding: 12px 24px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-weight: 500;
                    position: relative;
                    overflow: hidden;
                }

                .nav-pills .nav-link:before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.5s;
                }

                .nav-pills .nav-link:hover:before {
                    left: 100%;
                }

                .nav-pills .nav-link.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
                }

                .feature-card {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .feature-card:hover {
                    transform: translateY(-8px) scale(1.02);
                }

                .feature-card:before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
                    transform: rotate(45deg);
                    transition: all 0.6s;
                    opacity: 0;
                }

                .feature-card:hover:before {
                    animation: shimmer 0.6s ease-out;
                    opacity: 1;
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                }

                .search-input {
                    transition: all 0.3s ease;
                }

                .search-input:focus {
                    transform: scale(1.02);
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .btn-search {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .btn-search:hover {
                    transform: scale(1.1) rotate(90deg);
                }

                .status-indicator {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                .book-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 2rem;
                }

                @media (max-width: 768px) {
                    .book-grid {
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 1.5rem;
                    }
                }

                .hero-text {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .theme-toggle {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .theme-toggle:hover {
                    transform: scale(1.1);
                    rotate: 180deg;
                }
            `}</style>

            <FloatingParticles isDarkMode={isDarkMode} />
            
            <header className="py-5 position-relative" style={{ zIndex: 10 }}>
                <div className="container-fluid px-4">
                    <div className="position-absolute top-0 end-0 m-4">
                        <button 
                            className={`btn rounded-circle p-3 theme-toggle ${
                                isDarkMode 
                                    ? 'glassmorphism-dark text-white' 
                                    : 'glassmorphism text-dark'
                            }`} 
                            onClick={toggleTheme}
                        >
                            {isDarkMode ? <Sun /> : <Moon />}
                        </button>
                    </div>
                    
                    <div className="text-center">
                        <div className="mb-4">
                            <h1 className="display-3 fw-bold mb-3 hero-text animate-fade-in-up">
                                AI-Powered Book Discovery
                            </h1>
                            <p className={`lead mx-auto animate-fade-in-up ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`} style={{ 
                                maxWidth: '700px',
                                animationDelay: '0.2s',
                                lineHeight: '1.6'
                            }}>
                                Discover your next literary adventure with our intelligent recommendation engine.
                                Powered by advanced machine learning algorithms and curated by book lovers.
                            </p>
                        </div>
                        
                        {/* Stats Section */}
                        <div className="row justify-content-center mb-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <div className="col-auto">
                                <StatsCounter 
                                    value={10000} 
                                    label="Books Analyzed" 
                                    icon={<Book className="text-primary" />}
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                            <div className="col-auto">
                                <StatsCounter 
                                    value={50000} 
                                    label="User Ratings" 
                                    icon={<Star filled={true} className="text-warning" />}
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                            <div className="col-auto">
                                <StatsCounter 
                                    value={1000} 
                                    label="Daily Users" 
                                    icon={<Users className="text-success" />}
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                        </div>
                        
                        <div className={`d-flex align-items-center justify-content-center animate-fade-in-up ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`} style={{ animationDelay: '0.6s' }}>
                            <div className={`me-2 rounded-circle status-indicator ${
                                backendStatus === 'connected' ? 'bg-success' :
                                backendStatus === 'error' ? 'bg-danger' : 'bg-warning'
                            }`} style={{ width: '12px', height: '12px' }}></div>
                            <span className="fw-medium">
                                AI Engine {
                                    backendStatus === 'connected' ? 'Online & Ready' :
                                    backendStatus === 'error' ? 'Offline' : 'Initializing...'
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container-fluid px-4 position-relative" style={{ zIndex: 10 }}>
                {/* Feature Cards Section */}
                <div className="row g-4 mb-5 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                    <div className="col-12 col-md-4">
                        <div className="feature-card p-4 rounded-4 shadow-lg text-white position-relative overflow-hidden"
                             style={{ 
                                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                 minHeight: '200px'
                             }}>
                            <div className="position-relative z-2">
                                <div className="d-flex align-items-center mb-3">
                                    <TrendingUp />
                                    <span className="ms-2 fs-5 fw-bold">Trending Now</span>
                                </div>
                                <h3 className="fs-4 fw-bold mb-3">Popular Discoveries</h3>
                                <p className="opacity-90 mb-0">
                                    Explore books that are captivating readers worldwide. 
                                    Our algorithm analyzes reading patterns and ratings to bring you the most loved titles.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-4">
                        <div className="feature-card p-4 rounded-4 shadow-lg text-white position-relative overflow-hidden"
                             style={{ 
                                 background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                 minHeight: '200px'
                             }}>
                            <div className="position-relative z-2">
                                <div className="d-flex align-items-center mb-3">
                                    <Users />
                                    <span className="ms-2 fs-5 fw-bold">Just For You</span>
                                </div>
                                <h3 className="fs-4 fw-bold mb-3">AI Personalization</h3>
                                <p className="opacity-90 mb-0">
                                    Get tailored recommendations based on collaborative filtering. 
                                    Discover books loved by readers with similar tastes to yours.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-4">
                        <div className="feature-card p-4 rounded-4 shadow-lg text-white position-relative overflow-hidden"
                             style={{ 
                                 background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                 minHeight: '200px'
                             }}>
                            <div className="position-relative z-2">
                                <div className="d-flex align-items-center mb-3">
                                    <Search />
                                    <span className="ms-2 fs-5 fw-bold">Smart Search</span>
                                </div>
                                <h3 className="fs-4 fw-bold mb-3">Content Matching</h3>
                                <p className="opacity-90 mb-0">
                                    Find books similar to your favorites through advanced content analysis. 
                                    Perfect for discovering new authors in your preferred genres.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-5 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                    <ul className="nav nav-pills nav-fill">
                        {tabs.map((tab) => (
                            <li className="nav-item me-2" key={tab.id}>
                                <button
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setError(null);
                                    }}
                                    className={`nav-link d-flex align-items-center justify-content-center position-relative ${
                                        activeTab === tab.id ? 'active' : ''
                                    } ${isDarkMode ? 'text-white' : 'text-dark'}`}
                                    style={{ 
                                        border: activeTab === tab.id ? 'none' : `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                                        background: activeTab === tab.id 
                                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                            : isDarkMode 
                                                ? 'rgba(255, 255, 255, 0.05)' 
                                                : 'rgba(0, 0, 0, 0.02)'
                                    }}
                                >
                                    <span className="me-2">{tab.icon}</span>
                                    <div className="text-start">
                                        <div className="fw-semibold">{tab.label}</div>
                                        <div className="small opacity-75">{tab.subtitle}</div>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Search Section for Collaborative Filtering */}
                {activeTab === 'collaborative' && (
                    <div className="mb-5 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-8 col-lg-6">
                                <div className={`p-4 rounded-4 shadow-lg ${
                                    isDarkMode ? 'glassmorphism-dark' : 'glassmorphism'
                                }`}>
                                    <div className="text-center mb-3">
                                        <h4 className={`fw-bold ${isDarkMode ? 'text-white' : 'text-dark'}`}>
                                            Find Your Next Favorite
                                        </h4>
                                        <p className={`small ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Enter a book you love and we'll find similar recommendations
                                        </p>
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className={`form-control search-input border-0 py-3 px-4 ${
                                                isDarkMode 
                                                    ? 'bg-gray-800 text-white' 
                                                    : 'bg-white text-dark'
                                            }`}
                                            placeholder="e.g., The Da Vinci Code, Harry Potter, The Alchemist..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSearch();
                                                }
                                            }}
                                            style={{ 
                                                borderRadius: '50px 0 0 50px',
                                                fontSize: '16px'
                                            }}
                                        />
                                        <button 
                                            className="btn btn-search px-4"
                                            onClick={handleSearch}
                                            style={{ 
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                border: 'none',
                                                borderRadius: '0 50px 50px 0',
                                                color: 'white'
                                            }}
                                        >
                                            <Search />
                                        </button>
                                    </div>
                                    
                                    {/* Quick suggestions */}
                                    <div className="mt-3">
                                        <div className={`small mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Popular searches:
                                        </div>
                                        <div className="d-flex flex-wrap gap-2">
                                            {['The Da Vinci Code', 'Harry Potter', 'The Alchemist', 'To Kill a Mockingbird'].map((suggestion) => (
                                                <button
                                                    key={suggestion}
                                                    className={`btn btn-sm rounded-pill ${
                                                        isDarkMode 
                                                            ? 'btn-outline-light' 
                                                            : 'btn-outline-secondary'
                                                    }`}
                                                    onClick={() => {
                                                        setSearchTerm(suggestion);
                                                        setTimeout(handleSearch, 100);
                                                    }}
                                                    style={{ fontSize: '12px' }}
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Content Section */}
                <div className="animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <div>
                            <h2 className={`display-6 fw-bold mb-2 ${isDarkMode ? 'text-white' : 'text-dark'}`}>
                                {tabs.find(tab => tab.id === activeTab)?.description}
                            </h2>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {activeTab === 'popular' && 'Discover the most loved books from our extensive collection'}
                                {activeTab === 'collaborative' && 'Personalized recommendations based on user preferences'}
                                {activeTab === 'content' && 'Books similar to your favorites based on content analysis'}
                            </p>
                        </div>
                        {books.length > 0 && (
                            <div className={`text-end ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <div className="fw-semibold">{books.length} Books Found</div>
                                <div className="small">Curated just for you</div>
                            </div>
                        )}
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="alert alert-danger border-0 rounded-4 shadow-lg animate-fade-in-up" role="alert">
                            <div className="d-flex align-items-center">
                                <div className="me-3">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="15" y1="9" x2="9" y2="15"/>
                                        <line x1="9" y1="9" x2="15" y2="15"/>
                                    </svg>
                                </div>
                                <div>
                                    <h5 className="alert-heading mb-1">Oops! Something went wrong</h5>
                                    <p className="mb-0">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && <LoadingSpinner isDarkMode={isDarkMode} />}

                    {/* Backend Error State */}
                    {backendStatus === 'error' && !loading && (
                        <div className={`text-center py-5 rounded-4 ${
                            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                        }`}>
                            <div className="mb-4">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                                    <line x1="16" y1="8" x2="2" y2="22"/>
                                    <line x1="17.5" y1="15" x2="9" y2="15"/>
                                </svg>
                            </div>
                            <h3 className={`fw-bold mb-3 ${isDarkMode ? 'text-white' : 'text-dark'}`}>
                                AI Engine Offline
                            </h3>
                            <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Our recommendation engine is currently unavailable. Please ensure your FastAPI server is running.
                            </p>
                            <div className={`p-4 rounded-3 text-start mx-auto ${
                                isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-800 text-gray-100'
                            }`} style={{ maxWidth: '500px', fontFamily: 'Monaco, monospace' }}>
                                <div className="small">
                                    <div className="text-success">$ cd your-backend-directory</div>
                                    <div className="text-info">$ python -m uvicorn main:app --reload</div>
                                    <div className="text-warning">$ # Server will start on http://localhost:8000</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Books Grid */}
                    {!loading && !error && books.length > 0 && (
                        <div className="book-grid">
                            {books.map((book, index) => (
                                <BookCard 
                                    key={`${book['Book-Title'] || book.title}-${index}`}
                                    book={book} 
                                    isDarkMode={isDarkMode} 
                                    index={index}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && books.length === 0 && backendStatus === 'connected' && (
                        <div className="text-center py-5">
                            <div className="mb-4">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                                </svg>
                            </div>
                            <h3 className={`fw-bold mb-3 ${isDarkMode ? 'text-white' : 'text-dark'}`}>
                                No Books Found
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {activeTab === 'collaborative' 
                                    ? "Try searching for a different book title or check the spelling." 
                                    : "No recommendations are currently available for this category."
                                }
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className={`text-center py-5 mt-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8">
                            <div className="d-flex justify-content-center align-items-center flex-wrap gap-4 mb-3">
                                <div className="d-flex align-items-center">
                                    <div className="me-2 p-2 rounded-circle bg-gradient-to-r from-blue-500 to-purple-600">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                            <path d="M2 17l10 5 10-5"/>
                                            <path d="M2 12l10 5 10-5"/>
                                        </svg>
                                    </div>
                                    <span className="fw-semibold">FastAPI Backend</span>
                                </div>
                                
                                <div className="d-flex align-items-center">
                                    <div className="me-2 p-2 rounded-circle bg-gradient-to-r from-cyan-500 to-blue-500">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                            <circle cx="12" cy="12" r="10"/>
                                            <circle cx="12" cy="12" r="6"/>
                                            <circle cx="12" cy="12" r="2"/>
                                        </svg>
                                    </div>
                                    <span className="fw-semibold">React Frontend</span>
                                </div>
                                
                                <div className="d-flex align-items-center">
                                    <div className="me-2 p-2 rounded-circle bg-gradient-to-r from-green-500 to-teal-500">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                                        </svg>
                                    </div>
                                    <span className="fw-semibold">AI Powered</span>
                                </div>
                            </div>
                            
                            <p className="mb-0 small">
                                © 2024 AI Book Discovery Platform. Built with modern web technologies and powered by machine learning algorithms.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}