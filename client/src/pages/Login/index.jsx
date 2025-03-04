import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DefaultMetaTags } from '../../components/MetaTags';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const from = location.state?.from || '/dashboard';
      await login(email, password, from);
      console.log('redirecting to', from);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <DefaultMetaTags
        title="Login"
        description="Sign in to your StackNova account to post questions, share solutions, and engage with the developer community."
      />

      <div className="max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                       focus:outline-none focus:border-blue-500 focus:ring-2 
                       focus:ring-blue-200 dark:focus:ring-blue-800"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
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
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" />
            ) : (
              'Login'
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