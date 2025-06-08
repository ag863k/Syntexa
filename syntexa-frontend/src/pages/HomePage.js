import React from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

const HomePage = () => {
    const currentUser = AuthService.getCurrentUser();
    const currentYear = new Date().getFullYear();

    return (
        <div className="flex flex-col justify-center items-center text-center min-h-[85vh] px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <main className="flex-grow flex flex-col justify-center items-center">
                <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-6">
                    Welcome to Syntexa
                </h1>

                <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                    Your collaborative hub to store, share, and refine coding notes and solutions. Stop losing brilliant ideas and start building a collective knowledge base.
                </p>

                <div className="space-x-6">
                    <Link
                        to="/problems"
                        className="inline-block py-3 px-8 font-semibold rounded-md bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg transition-transform transform hover:scale-105"
                    >
                        Explore Problems
                    </Link>
                    {!currentUser && (
                        <Link
                            to="/signup"
                            className="inline-block py-3 px-8 font-semibold rounded-md border border-purple-500 text-purple-400 hover:bg-purple-700 hover:text-white transition-colors"
                        >
                            Sign Up
                        </Link>
                    )}
                </div>
            </main>

            <footer className="text-gray-400 text-sm text-center py-4">
                © {currentYear} Syntexa. All rights reserved.
            </footer>
        </div>
    );
};

export default HomePage;