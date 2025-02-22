// src/pages/Signup.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Get return path from location state or default to dashboard
      const from = location.state?.from || '/dashboard';
      await signup(username, email, password, from);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 theme-transition">
        Sign Up
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Input */}
        <div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="username"
              className="w-full pl-10 pr-4 py-3 rounded-lg
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white 
                       border border-gray-200 dark:border-gray-600
                       focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                       theme-transition"
              required
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3 rounded-lg
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white 
                       border border-gray-200 dark:border-gray-600
                       focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                       theme-transition"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (minimum 8 characters)"
              autoComplete="new-password"
              className="w-full pl-10 pr-4 py-3 rounded-lg
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white 
                       border border-gray-200 dark:border-gray-600
                       focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                       theme-transition"
              required
              minLength={8}
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-center text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg
           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
           disabled:opacity-50 disabled:cursor-not-allowed
           flex items-center justify-center cursor-pointer"
        >
          {isLoading ? (
            <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" />
          ) : (
            'Sign Up'
          )}
        </button>

        <p className="text-center text-gray-600 dark:text-gray-400 theme-transition">
          Already have an account?{' '}
          <Link
            to="/login"
            state={location.state} // Pass along the return path
            className="text-blue-600 hover:text-blue-700"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;