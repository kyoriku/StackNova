import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Lock, User, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/SEO';
import GoogleLoginButton from '../../components/GoogleLoginButton';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { signup, isLoading } = useAuth();
  const location = useLocation();

  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  const returnPath = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    try {
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
        noIndex={true}
      />

      <div className="max-w-md mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black bg-gradient-to-r 
                       from-gray-900 via-blue-800 to-purple-800 
                       dark:from-gray-100 dark:via-blue-300 dark:to-purple-300
                       bg-clip-text text-transparent mb-2">
            Join StackNova
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your account and start sharing knowledge
          </p>
        </div>

        <div className="relative bg-gradient-to-br from-white to-gray-50/50 
                      dark:from-gray-800 dark:to-gray-800/50
                      rounded-2xl p-6 
                      border border-gray-200/60 dark:border-gray-700/60
                      shadow-lg shadow-gray-900/5 dark:shadow-black/20
                      overflow-hidden">
          
          {/* Decorative gradient accent */}
          <div className="absolute top-0 right-0 w-32 h-32 
                        bg-gradient-to-br from-blue-500/5 to-purple-500/5
                        dark:from-blue-500/10 dark:to-purple-500/10
                        rounded-full blur-3xl -z-0" />

          <div className="relative z-10 space-y-6">
            {/* Google Signup Button */}
            <GoogleLoginButton returnPath={returnPath} text="Sign up with Google" />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-br from-white to-gray-50/50 
                               dark:from-gray-800 dark:to-gray-800/50
                               text-gray-500 dark:text-gray-400 font-medium">
                  Or sign up with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" size={18} />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    autoComplete="off"
                    className="w-full pl-11 pr-4 py-3 rounded-xl
                           bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                           text-gray-900 dark:text-gray-100 
                           border-2 border-gray-200 dark:border-gray-700
                           focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
                           focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" size={18} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="username"
                    className="w-full pl-11 pr-4 py-3 rounded-xl
                           bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                           text-gray-900 dark:text-gray-100 
                           border-2 border-gray-200 dark:border-gray-700
                           focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
                           focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" size={18} />
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
                    className="w-full pl-11 pr-4 py-3 rounded-xl
                           bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                           text-gray-900 dark:text-gray-100 
                           border-2 border-gray-200 dark:border-gray-700
                           focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
                           focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           transition-all duration-200"
                    required
                    minLength={8}
                    aria-describedby="password-requirements"
                  />
                </div>

                {/* Password requirements */}
                {(passwordFocused || password.length > 0) && (
                  <div
                    id="password-requirements"
                    className="mt-3 p-3 rounded-xl
                             bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                             border border-gray-200 dark:border-gray-700"
                    role="region"
                    aria-label="Password requirements"
                  >
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Password requirements:
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center">
                        {hasMinLength ? (
                          <CheckCircle className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0" size={16} />
                        ) : (
                          <XCircle className="text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" size={16} />
                        )}
                        <span className={`text-sm ${hasMinLength ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                          Minimum 8 characters
                        </span>
                      </div>
                      <div className="flex items-center">
                        {hasLetter ? (
                          <CheckCircle className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0" size={16} />
                        ) : (
                          <XCircle className="text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" size={16} />
                        )}
                        <span className={`text-sm ${hasLetter ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                          At least one letter
                        </span>
                      </div>
                      <div className="flex items-center">
                        {hasNumber ? (
                          <CheckCircle className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0" size={16} />
                        ) : (
                          <XCircle className="text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" size={16} />
                        )}
                        <span className={`text-sm ${hasNumber ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                          At least one number
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 rounded-2xl
                              bg-gradient-to-br from-red-50 to-red-100/50
                              dark:from-red-900/20 dark:to-red-900/10
                              border-2 border-red-200 dark:border-red-800/50
                              shadow-sm shadow-red-500/10 dark:shadow-black/20"
                     role="alert">
                  <p className="text-red-700 dark:text-red-300 text-sm font-medium text-center">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || (!isPasswordValid && password.length > 0)}
                className="w-full py-3 rounded-xl
                         bg-gradient-to-r from-blue-500 to-purple-500
                         dark:from-blue-600 dark:to-purple-600
                         text-white font-semibold
                         hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/40
                         hover:scale-105
                         focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:scale-100 disabled:hover:shadow-none
                         flex items-center justify-center 
                         transition-all duration-200 cursor-pointer"
              >
                {isLoading ? (
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" />
                ) : (
                  'Sign up'
                )}
              </button>
            </form>

            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                state={location.state}
                className="font-semibold text-transparent bg-clip-text 
                         bg-gradient-to-r from-blue-600 to-purple-600
                         dark:from-blue-400 dark:to-purple-400
                         hover:from-blue-700 hover:to-purple-700
                         dark:hover:from-blue-300 dark:hover:to-purple-300
                         transition-all duration-200"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;