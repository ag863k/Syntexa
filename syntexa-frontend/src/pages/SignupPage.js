import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

const PasswordRequirement = ({ meets, label }) => (
    <p className={`text-sm transition-colors ${meets ? 'text-green-400' : 'text-gray-500'}`}>
        <span className="mr-2">{meets ? '✓' : '•'}</span>{label}
    </p>
);

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);

    // Password requirements check
    const hasNumber = new RegExp(/[0-9]/).test(password);
    const hasSpecialChar = new RegExp(/[!@#$%^&*]/).test(password);
    const hasMinLength = password.length >= 6;

    const handleSignup = (e) => {
        e.preventDefault();
        setMessage('');
        setSuccessful(false);
        setLoading(true);

        // Check password requirements before submitting
        if (!hasMinLength || !hasNumber || !hasSpecialChar) {
             setMessage("Password does not meet all requirements.");
             setLoading(false);
             return;
        }

        AuthService.signup(username, email, password).then(
            (response) => {
                setMessage(response.data);
                setSuccessful(true);
                setLoading(false);
            },
            (error) => {
                const resMessage = (error.response?.data) || error.message || error.toString();
                setMessage(resMessage);
                setSuccessful(false);
                setLoading(false);
            }
        );
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
            <div className="w-full max-w-md p-8 space-y-6 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-purple-500/20 backdrop-blur-md" style={{boxShadow:'0 8px 32px 0 rgba(80,0,120,0.25)'}}>
                <h2 className="text-3xl font-bold text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_4px_24px_rgba(80,0,120,0.5)]">
                    Create an Account
                </h2>
                <p className="text-center text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300">
                        Sign In
                    </Link>
                </p>
                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="text-sm font-bold text-gray-400 block mb-2">Username</label>
                        <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 focus:border-cyan-400 focus:ring focus:ring-cyan-400 focus:ring-opacity-50 transition shadow-inner" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-gray-400 block mb-2">Email</label>
                        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 focus:border-cyan-400 focus:ring focus:ring-cyan-400 focus:ring-opacity-50 transition shadow-inner" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-gray-400 block mb-2">Password</label>
                        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 focus:border-cyan-400 focus:ring focus:ring-cyan-400 focus:ring-opacity-50 transition shadow-inner" required />
                        <div className="mt-2 pl-1">
                            <PasswordRequirement meets={hasMinLength} label="At least 6 characters long" />
                            <PasswordRequirement meets={hasNumber} label="Contains a number" />
                            <PasswordRequirement meets={hasSpecialChar} label="Contains a special character (!@#...)" />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-purple-700 via-gray-900 to-gray-800 hover:from-purple-800 hover:to-gray-900 rounded-xl text-white font-bold transition-all duration-300 shadow-lg border border-purple-700/40 disabled:opacity-50" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                {message && (
                    <div className={`mt-4 p-3 text-center text-sm rounded-md ${successful ? "bg-green-900/60 border border-green-500/50 text-green-200" : "bg-red-900/60 border border-red-500/50 text-red-200"} shadow-inner`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignupPage;