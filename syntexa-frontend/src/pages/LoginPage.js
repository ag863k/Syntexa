import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await AuthService.login(username, password);
      setLoading(false);
      navigate('/problems');
    } catch (error) {
      const resMessage =
        (error.response && error.response.data) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #161b22, #0d1117)' }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-[#0d1117] rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-4xl font-extrabold text-white text-center mb-2 font-mono tracking-wide">
          Syntexa
        </h2>
        <p className="text-center text-gray-400 mb-4">Log in to your account</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-semibold text-gray-400 block mb-2"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-[#161b22] text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-400 block mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#161b22] text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-md text-white font-bold transition duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        {message && (
          <div className="mt-4 p-3 rounded-md text-center text-sm bg-red-900 text-red-400">
            {message}
          </div>
        )}
        <p className="mt-6 text-center text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-cyan-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
