import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

const HomePage = () => {
    const currentUser = AuthService.getCurrentUser();
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        // Optionally, you could fetch user-specific data here if needed
    }, [currentUser]);

    return (
        <div className="flex flex-col justify-center items-center text-center min-h-[85vh] px-4 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
            <main className="flex-grow flex flex-col justify-center items-center">
                <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-6 drop-shadow-[0_4px_24px_rgba(80,0,120,0.5)]">
                    Welcome to Syntexa
                </h1>
                <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                    Your collaborative hub to store, share, and refine coding notes and solutions. Stop losing brilliant ideas and start building a collective knowledge base.
                </p>
                <div className="space-x-6">
                    <Link
                        to="/problems"
                        className="inline-block py-3 px-8 font-semibold rounded-xl bg-gradient-to-r from-gray-800 via-gray-900 to-gray-700 hover:from-gray-700 hover:to-gray-900 text-white shadow-2xl border border-gray-700/60 hover:border-purple-500/60 transition-transform transform hover:scale-105 backdrop-blur-md"
                        style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.37)'}}
                    >
                        Explore Problems
                    </Link>
                    {!currentUser && (
                        <Link
                            to="/signup"
                            className="inline-block py-3 px-8 font-semibold rounded-xl border border-purple-500/60 text-purple-300 hover:bg-purple-800/60 hover:text-white shadow-xl backdrop-blur-md transition-colors"
                            style={{boxShadow:'0 4px 16px 0 rgba(80,0,120,0.15)'}}
                        >
                            Sign Up
                        </Link>
                    )}
                    {currentUser && (
                        <Link
                            to="/mynotes"
                            className="inline-block py-3 px-8 font-semibold rounded-xl border border-cyan-500/60 text-cyan-300 hover:bg-cyan-800/60 hover:text-white shadow-xl backdrop-blur-md transition-colors ml-2"
                            style={{boxShadow:'0 4px 16px 0 rgba(0,200,255,0.10)'}}
                        >
                            My Notes
                        </Link>
                    )}
                </div>
            </main>
            <footer className="text-gray-500 text-sm text-center py-4 mt-8 border-t border-gray-800/60 w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-md">
                © {currentYear} Syntexa. All rights reserved.
            </footer>
        </div>
    );
};

export default HomePage;