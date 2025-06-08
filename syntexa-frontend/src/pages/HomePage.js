import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="text-center py-16 md:py-24 px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Welcome to Syntexa
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-400">
                Your collaborative hub to store, share, and refine coding notes and solutions. Stop losing your brilliant ideas and start building a collective knowledge base.
            </p>
            <Link to="/problems">
                <button className="mt-8 py-3 px-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white font-bold text-lg transition-all duration-300 transform hover:scale-105">
                    Explore Problems Hub
                </button>
            </Link>
        </div>
    );
};
export default HomePage;