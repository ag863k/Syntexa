import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/auth.service';
import ProblemService from '../services/problem.service';

const HomePage = () => {
    const currentUser = AuthService.getCurrentUser();
    const currentYear = new Date().getFullYear();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (currentUser) {
            ProblemService.getCurrentUserProfile().then(setProfile);
        }
    }, [currentUser]);

    const userProfileBanner = profile ? (
        <div className="w-full mb-6 p-4 rounded-xl bg-gradient-to-r from-cyan-900/20 via-gray-900/20 to-gray-800/20 border border-cyan-500/40 text-cyan-200 font-semibold shadow-lg text-center flex flex-col md:flex-row md:items-center md:justify-between backdrop-blur-md">
            <span>Welcome back, <span className="font-bold text-cyan-300">{profile.username}</span></span>
            <span className="text-xs text-gray-400 mt-2 md:mt-0">Ready to explore your notes?</span>
        </div>
    ) : null;

    return (
        <div className="flex flex-col justify-center items-center text-center min-h-[85vh] px-4 md:px-8">
            <main className="flex-grow flex flex-col justify-center items-center w-full max-w-6xl">
                {userProfileBanner}
                <div className="mb-8">
                    <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-6 drop-shadow-[0_4px_24px_rgba(80,0,120,0.5)]">
                        Syntexa
                    </h1>
                    <h2 className="text-2xl md:text-4xl font-bold text-cyan-300 mb-4">Coding Notes Hub</h2>
                    <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                        Your collaborative platform to store, share, and refine coding notes and solutions. 
                        Build your knowledge base and never lose a brilliant idea again.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-2xl items-center justify-center">
                    <Link
                        to="/mynotes"
                        className="w-full sm:w-auto py-4 px-8 font-bold rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-700 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 text-white shadow-2xl border border-cyan-500/40 hover:border-cyan-400/60 transition-all transform hover:scale-105 backdrop-blur-md text-lg"
                    >
                        {currentUser ? 'View My Notes' : 'Explore Notes'}
                    </Link>
                    
                    {!currentUser && (
                        <>
                            <Link
                                to="/signup"
                                className="w-full sm:w-auto py-4 px-8 font-bold rounded-xl border-2 border-purple-500/60 text-purple-300 hover:bg-purple-600/20 hover:border-purple-400 shadow-xl backdrop-blur-md transition-all text-lg"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto py-4 px-8 font-semibold rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all text-lg"
                            >
                                Sign In
                            </Link>
                        </>
                    )}
                </div>

                {/* Features Section */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    <div className="p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-xl border border-gray-700/50 backdrop-blur-md">
                        <div className="text-3xl mb-3">📝</div>
                        <h3 className="text-xl font-bold text-white mb-2">Create & Organize</h3>
                        <p className="text-gray-300 text-sm">Save your coding solutions with syntax highlighting and organize them by problems.</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-xl border border-gray-700/50 backdrop-blur-md">
                        <div className="text-3xl mb-3">🔗</div>
                        <h3 className="text-xl font-bold text-white mb-2">Share & Collaborate</h3>
                        <p className="text-gray-300 text-sm">Generate shareable links for your notes and collaborate with other developers.</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-xl border border-gray-700/50 backdrop-blur-md">
                        <div className="text-3xl mb-3">🚀</div>
                        <h3 className="text-xl font-bold text-white mb-2">Learn & Grow</h3>
                        <p className="text-gray-300 text-sm">Build your personal knowledge base and track your coding journey.</p>
                    </div>
                </div>
            </main>
            
            <footer className="text-gray-500 text-sm text-center py-6 mt-16 border-t border-gray-800/60 w-full">
                © {currentYear} Syntexa. Empowering developers worldwide.
            </footer>
        </div>
    );
};

export default HomePage;