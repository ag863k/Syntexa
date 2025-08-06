import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import AuthService from './services/auth.service';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProblemsListPage from './pages/ProblemsListPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import HomePage from './pages/HomePage';
import MyNotesPage from './pages/MyNotesPage';
import ProblemCreatePage from './pages/ProblemCreatePage';
import ProblemMultiCreatePage from './pages/ProblemMultiCreatePage';

const AppContent = () => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);
    }, []);

    // Listen for login/signup events and refresh user state
    useEffect(() => {
        const onStorage = () => {
            const user = AuthService.getCurrentUser();
            setCurrentUser(user);
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const logOut = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        navigate('/login');
    };    return (
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white min-h-screen font-sans">
            <nav className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 border-b border-purple-500/20 backdrop-blur-md sticky top-0 z-50 shadow-2xl">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                        <Link 
                            to="/" 
                            className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-300 hover:to-cyan-300 transition-all transform hover:scale-105"
                        >
                            Syntexa
                        </Link>
                        
                        <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-3 sm:gap-6">
                            <Link 
                                to="/mynotes" 
                                className="font-semibold text-gray-300 hover:text-cyan-400 transition-colors w-full sm:w-auto text-center px-3 py-2 rounded-lg hover:bg-gray-800/50"
                            >
                                My Notes
                            </Link>
                            
                            {currentUser ? (
                                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
                                    <span className="font-bold text-cyan-300 text-sm sm:text-base">
                                        {currentUser.username}
                                    </span>
                                    <button 
                                        onClick={logOut} 
                                        className="py-2 px-4 w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-white font-semibold shadow-lg transition-all transform hover:scale-105 text-sm sm:text-base"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                    <Link 
                                        to="/login" 
                                        className="font-semibold text-gray-300 hover:text-purple-400 transition-colors w-full sm:w-auto text-center px-3 py-2 rounded-lg hover:bg-gray-800/50 text-sm sm:text-base"
                                    >
                                        Sign In
                                    </Link>
                                    <Link 
                                        to="/signup" 
                                        className="py-2 px-4 w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg text-white font-bold shadow-lg transition-all transform hover:scale-105 text-center text-sm sm:text-base"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            
            <main className="container mx-auto px-4 py-6 sm:py-8">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/problems" element={<ProblemsListPage />} />
                    <Route path="/problems/:id" element={<ProblemDetailPage />} />
                    <Route path="/mynotes" element={<MyNotesPage />} />
                    <Route path="/problems/new" element={<ProblemCreatePage />} />
                    <Route path="/problems/new-multi" element={<ProblemMultiCreatePage />} />
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