import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/SEO';
import GoogleLoginButton from '../../components/GoogleLoginButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading, verifySession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle OAuth errors from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const oauthError = urlParams.get('error');
    
    if (oauthError === 'oauth_failed') {
      setError('Google login failed. Please try again.');
    } else if (oauthError === 'oauth_cancelled') {
      setError('Google login was cancelled.');
    }
  }, [location]);

  // Check for OAuth return and verify session
  useEffect(() => {
    const handleOAuthReturn = async () => {
      // If coming back from OAuth, verify session
      if (location.state?.fromOAuth || localStorage.getItem('oauth_return_path')) {
        const returnPath = localStorage.getItem('oauth_return_path');
        localStorage.removeItem('oauth_return_path');
        
        // Verify session and redirect if authenticated
        try {
          await verifySession();
          if (returnPath) {
            navigate(returnPath, { replace: true });
          }
        } catch (error) {
          console.error('OAuth session verification failed:', error);
        }
      }
    };

    handleOAuthReturn();
  }, [location, verifySession, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const from = location.state?.from || '/dashboard';
      await login(email, password, from);
    } catch (err) {
      setError(err.message);
    }
  };

  const returnPath = location.state?.from || '/dashboard';

  return (
    <>
      <SEO
        title="Log In"
        description="Sign in to your StackNova account to post questions, share solutions, and engage with the developer community."
        canonicalPath="/login"
        noIndex={true}
      />

      <div className="max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Log In
        </h1>

        {/* Google Login Button */}
        <div className="mb-6">
          <GoogleLoginButton returnPath={returnPath} />
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                autoComplete="email"
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
                placeholder="Enter your password"
                autoComplete="current-password"
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

          {error && (
            <div 
              className="py-2 px-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30 text-center"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg
           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
           disabled:opacity-50 disabled:cursor-not-allowed
           flex items-center justify-center transition-colors duration-200 cursor-pointer"
          >
            {isLoading ? (
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" />
            ) : (
              'Log in'
            )}
          </button>

          <p className="text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              state={location.state}
              className="text-blue-600 hover:text-blue-700"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;