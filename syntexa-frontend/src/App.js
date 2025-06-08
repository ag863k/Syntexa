import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import AuthService from './services/auth.service';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProblemsListPage from './pages/ProblemsListPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import HomePage from './pages/HomePage';

const AppContent = () => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const logOut = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        navigate('/login');
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen font-sans">
            <nav className="bg-slate-800/50 p-4 border-b border-purple-500/20 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold hover:text-purple-400 transition-colors">Syntexa</Link>
                    <div className="flex items-center space-x-6">
                        <Link to="/problems" className="font-medium text-gray-300 hover:text-purple-400 transition-colors">Problems Hub</Link>
                        {currentUser ? (
                            <div className="flex items-center space-x-4">
                                <span className="font-bold hidden sm:block">{currentUser.username}</span>
                                <button onClick={logOut} className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold">
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="font-medium text-gray-300 hover:text-purple-400 transition-colors">Login</Link>
                                <Link to="/signup" className="py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-md text-white font-bold">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="container mx-auto p-4 mt-8">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/problems" element={<ProblemsListPage />} />
                    <Route path="/problems/:id" element={<ProblemDetailPage />} />
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </main>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;