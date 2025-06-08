import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        AuthService.login(username, password).then(
            () => {
                navigate("/problems"); // Redirect to problems hub after login
            },
            (error) => {
                const resMessage = 
                    (error.response?.data?.message) || 
                    error.response?.data || 
                    error.message || 
                    error.toString();
                
                setMessage(resMessage);
                setLoading(false);
            }
        );
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
            <div className="w-full max-w-md p-8 space-y-6 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-cyan-500/20 backdrop-blur-md" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.37)'}}>
                <h2 className="text-3xl font-bold text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_4px_24px_rgba(80,0,120,0.5)]">
                    Welcome Back
                </h2>
                <p className="text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                        Sign Up
                    </Link>
                </p>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="text-sm font-bold text-gray-400 block mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 focus:border-purple-400 focus:ring focus:ring-purple-400 focus:ring-opacity-50 transition shadow-inner"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-gray-400 block mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 focus:border-purple-400 focus:ring focus:ring-purple-400 focus:ring-opacity-50 transition shadow-inner"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-700 via-gray-900 to-gray-800 hover:from-purple-800 hover:to-gray-900 rounded-xl text-white font-bold transition-all duration-300 shadow-lg border border-purple-700/40 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                {message && (
                    <div className="mt-4 p-3 text-center text-sm rounded-md bg-red-900/60 border border-red-500/50 text-red-200 shadow-inner">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;