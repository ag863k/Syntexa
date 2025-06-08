import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6">
      <main className="flex items-center justify-center flex-grow">
        <div className="max-w-4xl text-center">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
            Welcome to Coding Notes Hub
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Collaborate, share and learn coding problem solutions and approaches with the community.
            Sign up to add your own notes or browse existing problems.
          </p>
          <div className="space-x-6">
            <Link
              to="/signup"
              className="inline-block py-3 px-8 font-semibold rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg transition"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="inline-block py-3 px-8 font-semibold rounded-md border border-cyan-500 text-cyan-400 hover:bg-cyan-700 hover:text-white transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </main>
      <footer className="text-gray-600 text-sm text-center mb-4">
        © {currentYear} Coding Notes Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
