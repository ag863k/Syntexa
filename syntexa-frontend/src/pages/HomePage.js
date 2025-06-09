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

    // If logged in, redirect to My Notes directly
    useEffect(() => {
        if (currentUser) {
            window.location.replace('/mynotes');
        }
    }, [currentUser]);

    // Professional user profile at top (not shown if redirecting)
    const userProfileBanner = profile ? (
        <div className="w-full mb-6 p-4 rounded-xl bg-gradient-to-r from-cyan-900 via-gray-900 to-gray-800 border border-cyan-500/40 text-cyan-200 font-semibold shadow-lg text-center flex flex-col md:flex-row md:items-center md:justify-between">
            <span>Logged in as <span className="font-bold">{profile.username}</span> (ID: {profile.id})</span>
            <span className="text-xs text-gray-400 mt-2 md:mt-0">Email: {profile.email}</span>
        </div>
    ) : null;

    return (
        <div className="flex flex-col justify-center items-center text-center min-h-[85vh] px-2 md:px-4 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
            <main className="flex-grow flex flex-col justify-center items-center w-full">
                {userProfileBanner}
                <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4 md:mb-6 drop-shadow-[0_4px_24px_rgba(80,0,120,0.5)] break-words max-w-2xl md:max-w-4xl">
                    Welcome to Syntexa
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-2 md:mb-4">Notes Hub</h2>
                <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl md:max-w-3xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] break-words">
                    Your collaborative Notes Hub to store, share, and refine coding notes and solutions. Stop losing brilliant ideas and start building a collective knowledge base.
                </p>
                <div className="flex flex-col md:flex-row gap-4 w-full max-w-lg justify-center">
                    <Link
                        to="/mynotes"
                        className="flex-1 py-3 px-8 font-semibold rounded-xl bg-gradient-to-r from-cyan-800 via-cyan-900 to-cyan-700 hover:from-cyan-700 hover:to-cyan-900 text-white shadow-2xl border border-cyan-700/60 hover:border-purple-500/60 transition-transform transform hover:scale-105 backdrop-blur-md text-lg md:text-xl"
                        style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.37)'}}
                    >
                        My Notes
                    </Link>
                </div>
            </main>
            <footer className="text-gray-500 text-sm text-center py-4 mt-8 border-t border-gray-800/60 w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-md">
                © {currentYear} Syntexa. All rights reserved.
            </footer>
        </div>
    );
};

export default HomePage;