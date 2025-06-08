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
                window.location.reload();
            },
            (error) => {
                const resMessage = (error.response?.data?.message) || error.response?.data || error.message || error.toString();
                setMessage(resMessage);
                setLoading(false);
            }
        );
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-slate-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-cyan-500/20">
                <h2 className="text-3xl font-bold text-center text-white">Welcome Back</h2>
                <p className="text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-cyan-400 hover:text-cyan-300">Sign Up</Link>
                </p>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="text-sm font-bold text-gray-400 block mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 text-white bg-gray-700/50 rounded-md border border-gray-600 focus:border-cyan-400 focus:ring focus:ring-cyan-400 focus:ring-opacity-50 transition"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-gray-400 block mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 text-white bg-gray-700/50 rounded-md border border-gray-600 focus:border-cyan-400 focus:ring focus:ring-cyan-400 focus:ring-opacity-50 transition"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-md text-white font-bold transition-all duration-300 disabled:opacity-50" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                {message && (
                    <div className="mt-4 p-3 text-center text-sm rounded-md bg-red-800/50 border border-red-500/50 text-red-200">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};
export default LoginPage;