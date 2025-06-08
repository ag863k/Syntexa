import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import AuthService from './services/auth.service';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProblemsListPage from './pages/ProblemsListPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import HomePage from './pages/HomePage';

const AppContent = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(AuthService.getCurrentUser());
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div
      className="min-h-screen font-sans text-white"
      style={{
        background: 'linear-gradient(135deg, #0d1117, #161b22)',
        backgroundAttachment: 'fixed',
      }}
    >
      <nav className="bg-[#161b22]/90 p-4 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-3xl font-extrabold text-white hover:text-cyan-400 flex items-center space-x-2 select-none font-mono tracking-wider"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Syntexa</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              to="/problems"
              className="font-medium text-gray-300 hover:text-cyan-400 transition-colors"
            >
              Problems Hub
            </Link>
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="font-semibold hidden sm:block">
                  {currentUser.username}
                </span>
                <button
                  onClick={logOut}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="font-medium text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-md text-white font-bold"
                >
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
