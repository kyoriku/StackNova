import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, LayoutDashboard, LogIn, LogOut, Sun, Moon, Menu, X, User, UserPlus } from 'lucide-react';
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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

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
    return location.pathname === path;
  };

  const linkClasses = (path) => {
  const active = isActive(path);
  return `flex items-center gap-2 px-3 py-2 rounded-xl font-semibold
          transition-all duration-200
          focus:outline-none
          ${active 
            ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-transparent'}`;
};

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                     shadow-sm dark:shadow-md dark:shadow-black/10 
                     border-b border-gray-200/60 dark:border-gray-700/60 
                     sticky top-0 z-50">
      <nav ref={navRef} className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <Link
            to="/"
            className="flex items-center text-xl font-black gap-2
                     bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 
                     dark:from-gray-100 dark:via-blue-300 dark:to-purple-300
                     bg-clip-text text-transparent
                     hover:from-blue-600 hover:to-purple-600
                     dark:hover:from-blue-400 dark:hover:to-purple-400
                     transition-all duration-200"
            onMouseEnter={() => prefetchPosts()}
          >
            <img
              src="/favicon.svg"
              alt="StackNova Logo"
              className="w-8 h-8"
            />
            StackNova
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl 
                     hover:bg-gray-100 dark:hover:bg-gray-700/50 
                     transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu size={24} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={linkClasses('/')}
                  onMouseEnter={() => prefetchPosts()}
                >
                  <List size={18} />
                  Posts
                </Link>
                <Link
                  to="/dashboard"
                  className={linkClasses('/dashboard')}
                  onMouseEnter={() => prefetchDashboard()}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link
                  to={`/user/${user.username}`}
                  className={linkClasses(`/user/${user.username}`)}
                  onMouseEnter={() => prefetchUserProfile(user.username)}
                >
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold
                           text-gray-700 dark:text-gray-300 
                           hover:bg-gray-100 dark:hover:bg-gray-700/50
                           transition-all duration-200 cursor-pointer"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl
                           border-2 border-gray-200 dark:border-gray-700 
                           hover:border-blue-300 dark:hover:border-blue-500/50
                           text-gray-700 dark:text-gray-300 
                           hover:bg-gray-50 dark:hover:bg-gray-700/50
                           font-semibold
                           transition-all duration-200"
                >
                  <LogIn size={18} />
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl
                           bg-gradient-to-r from-blue-500 to-purple-500
                           dark:from-blue-600 dark:to-purple-600
                           text-white font-semibold
                           hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/40
                           hover:scale-105
                           transition-all duration-200"
                >
                  <UserPlus size={18} />
                  Sign up
                </Link>
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl 
                       bg-gray-100 dark:bg-gray-700/50 
                       hover:bg-gray-200 dark:hover:bg-gray-600/50
                       cursor-pointer transition-all duration-200
                       hover:scale-105"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun size={18} className="text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon size={18} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col space-y-2 pb-4 
                        fixed inset-x-0 top-16 
                        bg-white/95 dark:bg-gray-800/95 backdrop-blur-md
                        shadow-xl dark:shadow-2xl dark:shadow-black/40
                        p-4 z-50 max-h-screen overflow-y-auto 
                        border-b-2 border-gray-200/60 dark:border-gray-700/60">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={linkClasses('/')}
                  onMouseEnter={() => prefetchPosts()}
                >
                  <List size={18} />
                  Posts
                </Link>
                <Link
                  to="/dashboard"
                  className={linkClasses('/dashboard')}
                  onMouseEnter={() => prefetchDashboard()}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link
                  to={`/user/${user.username}`}
                  className={linkClasses(`/user/${user.username}`)}
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
                  className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold
                           text-gray-700 dark:text-gray-300 
                           hover:bg-gray-100 dark:hover:bg-gray-700/50
                           transition-all duration-200 cursor-pointer"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                           border-2 border-gray-200 dark:border-gray-700 
                           hover:border-blue-300 dark:hover:border-blue-500/50
                           text-gray-700 dark:text-gray-300 
                           hover:bg-gray-50 dark:hover:bg-gray-700/50
                           font-semibold
                           transition-all duration-200"
                >
                  <LogIn size={18} />
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                           bg-gradient-to-r from-blue-500 to-purple-500
                           dark:from-blue-600 dark:to-purple-600
                           text-white font-semibold
                           hover:shadow-lg hover:shadow-blue-500/30
                           transition-all duration-200"
                >
                  <UserPlus size={18} />
                  Sign up
                </Link>
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 p-3 rounded-xl 
                       bg-gray-100 dark:bg-gray-700/50 
                       hover:bg-gray-200 dark:hover:bg-gray-600/50
                       cursor-pointer transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <>
                  <Sun size={18} className="text-gray-700 dark:text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} className="text-gray-700" />
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">Dark Mode</span>
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