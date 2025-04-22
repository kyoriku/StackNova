import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, LogIn, LogOut, Sun, Moon, Menu, X, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { usePrefetchUserProfile } from '../pages/PostDetails/hooks/usePrefetchUserProfile';
import { usePrefetchDashboard } from '../pages/Dashboard/hooks/usePrefetchDashboard';
import { usePrefetchPosts } from '../pages/Posts/hooks/usePrefetchPosts';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const prefetchUserProfile = usePrefetchUserProfile();
  const prefetchDashboard = usePrefetchDashboard();
  const prefetchPosts = usePrefetchPosts();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Control body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Disable scrolling on body
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = '';
    }

    // Cleanup function to ensure scroll is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300';
  };

  const linkClasses = "flex items-center gap-2 hover:text-blue-700 dark:hover:text-blue-400";

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg relative z-50">
      <nav ref={navRef} className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <Link
            to="/"
            className="flex items-center text-xl font-bold text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400"
            onMouseEnter={() => prefetchPosts()}
          >
            <img
              src="/favicon.svg"
              alt="StackNova Logo"
              className="w-8 h-8 mr-2"
            />
            StackNova
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} className="text-gray-700 dark:text-gray-300" /> : <Menu size={24} className="text-gray-700 dark:text-gray-300" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`${isActive('/')} ${linkClasses}`}
              onMouseEnter={() => prefetchPosts()}
            >
              <Home size={18} />
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`${isActive('/dashboard')} ${linkClasses}`}
                  onMouseEnter={() => prefetchDashboard()}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link
                  to={`/user/${user.username}`}
                  className={`${isActive(`/user/${user.username}`)} ${linkClasses}`}
                  onMouseEnter={() => prefetchUserProfile(user.username)}
                >
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className={`text-gray-700 dark:text-gray-300 ${linkClasses} cursor-pointer`}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`${isActive('/login')} ${linkClasses}`}
              >
                <LogIn size={18} />
                Login
              </Link>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun size={18} className="text-gray-300" />
              ) : (
                <Moon size={18} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col space-y-4 pb-4 fixed inset-x-0 top-16 
          bg-white dark:bg-gray-800 shadow-lg p-4 z-50 max-h-screen overflow-y-auto 
          border-b border-gray-300 dark:border-gray-700">
            <Link
              to="/"
              className={`${isActive('/')} ${linkClasses}`}
              onMouseEnter={() => prefetchPosts()}

            >
              <Home size={18} />
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`${isActive('/dashboard')} ${linkClasses}`}
                  onMouseEnter={() => prefetchDashboard()}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link
                  to={`/user/${user.username}`}
                  className={`${isActive(`/user/${user.username}`)} ${linkClasses}`}
                  onMouseEnter={() => prefetchUserProfile(user.username)}
                >
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className={`text-gray-700 dark:text-gray-300 ${linkClasses} cursor-pointer`}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`${isActive('/login')} ${linkClasses}`}
              >
                <LogIn size={18} />
                Login
              </Link>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <>
                  <Sun size={18} className="text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} className="text-gray-700" />
                  <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                </>
              )}
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;