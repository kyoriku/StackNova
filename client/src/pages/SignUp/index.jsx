import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Lock, User, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/SEO';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { signup, isLoading } = useAuth();
  const location = useLocation();

  // Password requirement checks
  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if password meets requirements
    if (!isPasswordValid) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    try {
      // Get return path from location state or default to dashboard
      const from = location.state?.from || '/dashboard';
      await signup(username, email, password, from);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <SEO
        title="Sign Up"
        description="Create your StackNova account and join our community of developers to share knowledge and find solutions."
        canonicalPath="/signup"
        noIndex={true} // Set noIndex to true based on robots.txt
      />

      <div className="max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 rounded-lg
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white 
                       border border-gray-200 dark:border-gray-600
                       focus:outline-none focus:border-blue-500 focus:ring-2 
                       focus:ring-blue-200 dark:focus:ring-blue-800"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 rounded-lg
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white 
                       border border-gray-200 dark:border-gray-600
                       focus:outline-none focus:border-blue-500 focus:ring-2 
                       focus:ring-blue-200 dark:focus:ring-blue-800"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="Create a secure password"
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-3 rounded-lg
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white 
                       border border-gray-200 dark:border-gray-600
                       focus:outline-none focus:border-blue-500 focus:ring-2 
                       focus:ring-blue-200 dark:focus:ring-blue-800"
                required
                minLength={8}
                aria-describedby="password-requirements"
              />
            </div>

            {/* Password requirements - only show when password field is focused or has content */}
            {(passwordFocused || password.length > 0) && (
              <div 
                id="password-requirements"
                className="mt-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                role="region"
                aria-label="Password requirements"
              >
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password requirements:</p>
                <div className="space-y-1">
                  <div className="flex items-center">
                    {hasMinLength ? (
                      <CheckCircle className="text-green-600 dark:text-green-500 mr-2" size={16} />
                    ) : (
                      <XCircle className="text-gray-600 dark:text-gray-400 mr-2" size={16} />
                    )}
                    <span className={`text-sm ${hasMinLength ? 'text-green-600 dark:text-green-500' : 'text-gray-600 dark:text-gray-400'}`}>
                      Minimum 8 characters
                    </span>
                  </div>
                  <div className="flex items-center">
                    {hasLetter ? (
                      <CheckCircle className="text-green-600 dark:text-green-500 mr-2" size={16} />
                    ) : (
                      <XCircle className="text-gray-600 dark:text-gray-400 mr-2" size={16} />
                    )}
                    <span className={`text-sm ${hasLetter ? 'text-green-600 dark:text-green-500' : 'text-gray-600 dark:text-gray-400'}`}>
                      At least one letter
                    </span>
                  </div>
                  <div className="flex items-center">
                    {hasNumber ? (
                      <CheckCircle className="text-green-600 dark:text-green-500 mr-2" size={16} />
                    ) : (
                      <XCircle className="text-gray-600 dark:text-gray-400 mr-2" size={16} />
                    )}
                    <span className={`text-sm ${hasNumber ? 'text-green-600 dark:text-green-500' : 'text-gray-600 dark:text-gray-400'}`}>
                      At least one number
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div 
              className="py-2 px-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !isPasswordValid && password.length > 0}
            className="w-full py-3 bg-blue-600 text-white rounded-lg
           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
           disabled:opacity-50 disabled:cursor-not-allowed
           flex items-center justify-center cursor-pointer"
          >
            {isLoading ? (
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" />
            ) : (
              'Sign up'
            )}
          </button>

          <p className="text-center text-gray-600 dark:text-gray-400">
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
    </>
  );
};

export default Signup;