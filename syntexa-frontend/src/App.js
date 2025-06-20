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
            <nav className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 p-4 border-b border-purple-500/20 backdrop-blur-md sticky top-0 z-50 shadow-2xl">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                    <Link to="/" className="text-xl sm:text-2xl font-bold hover:text-purple-400 transition-colors drop-shadow-[0_2px_8px_rgba(80,0,120,0.2)]">Syntexa</Link>
                    <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-2 sm:gap-6 mt-2 sm:mt-0">
                        <Link to="/mynotes" className="font-medium text-gray-300 hover:text-purple-400 transition-colors w-full sm:w-auto text-center text-sm sm:text-base">Notes Hub</Link>
                        {currentUser ? (
                            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
                                <span className="font-bold text-gray-200 drop-shadow-[0_2px_8px_rgba(80,0,120,0.2)] text-sm sm:text-base">{currentUser.username}</span>
                                <button onClick={logOut} className="py-2 px-4 w-full sm:w-auto bg-gradient-to-r from-red-700 via-gray-900 to-gray-800 hover:from-red-800 hover:to-gray-900 rounded-xl text-white font-semibold shadow-lg border border-red-700/40 text-sm sm:text-base">Log Out</button>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
                                <Link to="/login" className="font-medium text-gray-300 hover:text-purple-400 transition-colors w-full sm:w-auto text-center text-sm sm:text-base">Login</Link>
                                <Link to="/signup" className="py-2 px-4 w-full sm:w-auto bg-gradient-to-r from-purple-700 via-gray-900 to-gray-800 hover:from-purple-800 hover:to-gray-900 rounded-xl text-white font-bold shadow-lg border border-purple-700/40 text-center text-sm sm:text-base">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <main className="container mx-auto p-4 mt-4 sm:mt-8">
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