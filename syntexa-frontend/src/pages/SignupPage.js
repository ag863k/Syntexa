import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

const PasswordRequirement = ({ meets, label }) => (
  <p className={`text-sm transition-colors ${meets ? 'text-green-400' : 'text-gray-500'}`}>
    <span className="mr-2">{meets ? '✓' : '•'}</span>
    {label}
  </p>
);

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  const navigate = useNavigate();

  // Password requirements using regex validations
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const hasMinLength = password.length >= 6;

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessful(false);

    // Check password requirements before proceeding
    if (!hasMinLength || !hasNumber || !hasSpecialChar) {
      setMessage('Password does not meet all requirements.');
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.signup(username, email, password);
      // Assume response.data contains a success message
      setMessage(`${response.data} You can now log in.`);
      setSuccessful(true);
      setLoading(false);
      // Delay navigation by 2 seconds so the user can see the success message
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const resMessage =
        (error.response && error.response.data) || error.message || error.toString();
      setMessage(resMessage);
      setSuccessful(false);
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
        <p className="text-center text-gray-400 mb-4">
          Create your account to join the community
        </p>
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-semibold text-gray-400 block mb-2">
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
            <label htmlFor="email" className="text-sm font-semibold text-gray-400 block mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#161b22] text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-gray-400 block mb-2">
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
            <div className="mt-2 pl-1">
              <PasswordRequirement meets={hasMinLength} label="At least 6 characters long" />
              <PasswordRequirement meets={hasNumber} label="Contains a number" />
              <PasswordRequirement meets={hasSpecialChar} label="Contains a special character (!@#...)" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-md text-white font-bold transition duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        {message && (
          <div
            className={`mt-4 p-3 rounded-md text-center text-sm ${
              successful ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
            }`}
          >
            {message}
          </div>
        )}
        <p className="mt-6 text-center text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
