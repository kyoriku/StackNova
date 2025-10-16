import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

// Match the backend timeout
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutes
const WARNING_TIME = 59 * 60 * 1000; // Warn at 59 minutes (1 minute before logout)
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

// Define which routes require authentication
const PROTECTED_ROUTES = ['/dashboard', '/new-post', '/edit-post'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthStatusResolved, setIsAuthStatusResolved] = useState(false);
  const [rememberMeActive, setRememberMeActive] = useState(false);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inactivityTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const lastVisibleTimeRef = useRef(Date.now());
  const broadcastChannelRef = useRef(null);
  const rememberMeActiveRef = useRef(rememberMeActive);

  // Keep rememberMeActive ref updated
  useEffect(() => {
    rememberMeActiveRef.current = rememberMeActive;
  }, [rememberMeActive]);

  // Initialize BroadcastChannel for cross-tab communication
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannelRef.current = new BroadcastChannel('auth_channel');

      broadcastChannelRef.current.onmessage = (event) => {
        if (event.data.type === 'LOGOUT') {
          handleSessionExpired(event.data.message, true); // true = skip broadcast
        } else if (event.data.type === 'ACTIVITY') {
          // Sync activity across tabs
          lastActivityRef.current = event.data.timestamp;
          // Use ref to get current rememberMeActive value
          if (!rememberMeActiveRef.current) {
            resetInactivityTimer();
          }
        }
      };

      return () => {
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.close();
        }
      };
    }
  }, []); // Empty deps - create once and never recreate

  const verifySession = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/session`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        setRememberMeActive(data.rememberMe || false);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setRememberMeActive(false);
      }
    } catch (error) {
      console.error('Session verification error:', error);
      setUser(null);
      setIsAuthenticated(false);
      setRememberMeActive(false);
    } finally {
      setIsAuthStatusResolved(true);
      setIsLoading(false);
    }
  };

  // Session heartbeat check
  const checkHeartbeat = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/heartbeat`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        }
      );

      if (!response.ok) {
        const data = await response.json();

        if (data.code === 'SESSION_TIMEOUT' || 
            data.code === 'SESSION_SECURITY_VIOLATION' ||
            data.code === 'UNAUTHORIZED') {
          handleSessionExpired(data.message);
        }
      }
    } catch (error) {
      console.error('Heartbeat check failed:', error);
    }
  }, [isAuthenticated]);

  // Check if current route is protected
  const isProtectedRoute = useCallback((pathname) => {
    return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  }, []);

  // Handle session expiration
  const handleSessionExpired = useCallback(async (message, skipBroadcast = false) => {
    // Clear all timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }

    // Hide warning modal if showing
    setShowInactivityWarning(false);

    // Broadcast logout to other tabs
    if (!skipBroadcast && broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: 'LOGOUT',
          message: message || 'Your session has expired. Please log in again.'
        });
      } catch (error) {
        console.error('Broadcast failed:', error);
      }
    }

    // Destroy session on backend
    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/logout`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );
    } catch (error) {
      console.error('Logout during session expiration failed:', error);
    }

    // Update local state
    setUser(null);
    setIsAuthenticated(false);
    setRememberMeActive(false);

    // Store message for login page
    sessionStorage.setItem('loginMessage', message || 'Your session has expired. Please log in again.');

    // Only redirect to login if on a protected route
    if (isProtectedRoute(location.pathname)) {
      navigate('/login', { replace: true });
    }
  }, [navigate, location.pathname, isProtectedRoute]);

  // Show warning before logout
  const showWarning = useCallback(() => {
    if (!isAuthenticated || rememberMeActive) return;
    setShowInactivityWarning(true);
  }, [isAuthenticated, rememberMeActive]);

  // User dismisses warning and continues session
  const dismissWarning = useCallback(() => {
    setShowInactivityWarning(false);
    resetInactivityTimer();

    // Broadcast activity to other tabs
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: 'ACTIVITY',
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('Broadcast failed:', error);
      }
    }
  }, []);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    // Skip if remember me is active
    if (!isAuthenticated || rememberMeActive) return;

    lastActivityRef.current = Date.now();

    // Clear existing timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }

    // Hide warning if showing
    setShowInactivityWarning(false);

    // Set warning timer (59 minutes)
    warningTimerRef.current = setTimeout(() => {
      showWarning();
    }, WARNING_TIME);

    // Set logout timer (60 minutes)
    inactivityTimerRef.current = setTimeout(() => {
      handleSessionExpired('Your session expired due to inactivity. Please log in again.');
    }, INACTIVITY_TIMEOUT);
  }, [isAuthenticated, rememberMeActive, handleSessionExpired, showWarning]);

  // Broadcast activity to other tabs
  const broadcastActivity = useCallback(() => {
    if (broadcastChannelRef.current && isAuthenticated && !rememberMeActive) {
      try {
        broadcastChannelRef.current.postMessage({
          type: 'ACTIVITY',
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('Broadcast failed:', error);
      }
    }
  }, [isAuthenticated, rememberMeActive]);

  // Handle tab visibility changes
  useEffect(() => {
    if (!isAuthenticated || rememberMeActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden - store the time
        lastVisibleTimeRef.current = Date.now();
      } else {
        // Tab is visible again - check elapsed time
        const hiddenDuration = Date.now() - lastVisibleTimeRef.current;

        if (hiddenDuration > INACTIVITY_TIMEOUT) {
          handleSessionExpired('Your session expired due to inactivity. Please log in again.');
        } else {
          // Reset timer since user returned
          resetInactivityTimer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, rememberMeActive, handleSessionExpired, resetInactivityTimer]);

  // Track user activity
  useEffect(() => {
    if (!isAuthenticated || rememberMeActive) return;

    // Set initial timer
    resetInactivityTimer();

    // Add activity listeners
    const handleActivity = () => {
      resetInactivityTimer();
      broadcastActivity(); // Sync with other tabs
    };

    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, handleActivity, true);
    });

    return () => {
      // Cleanup
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, handleActivity, true);
      });
    };
  }, [isAuthenticated, rememberMeActive, resetInactivityTimer, broadcastActivity]);

  // Set up periodic heartbeat check
  useEffect(() => {
    if (!isAuthenticated) return;

    checkHeartbeat();

    const interval = setInterval(checkHeartbeat, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, checkHeartbeat]);

  useEffect(() => {
    verifySession();
  }, []);

  const signup = async (username, email, password, returnPath) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username, email, password }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create account');
      }

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
      setRememberMeActive(false);
      navigate(returnPath || '/dashboard');
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, returnPath, rememberMe = false) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email,
            password,
            rememberMe
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to login');
      }

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
      setRememberMeActive(rememberMe);
      navigate(returnPath || '/dashboard');
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/logout`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setRememberMeActive(false);
      setShowInactivityWarning(false);

      // Clear all timers
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      isAuthStatusResolved,
      showInactivityWarning,
      dismissWarning,
      signup,
      login,
      logout,
      verifySession,
      handleSessionExpired,
      resetInactivityTimer,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
