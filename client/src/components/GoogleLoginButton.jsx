const GoogleLoginButton = ({ returnPath, text = "Continue with Google" }) => {
  const handleGoogleLogin = () => {
    const redirectPath = returnPath || window.location.pathname;
    const state = btoa(JSON.stringify({
      returnPath: redirectPath,
      timestamp: Date.now()
    }));
    
    const authUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/google?state=${encodeURIComponent(state)}`;
    window.location.href = authUrl;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 
               border-2 border-gray-200 dark:border-gray-700 
               rounded-xl 
               bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm
               text-gray-700 dark:text-gray-300 
               hover:bg-gray-50 dark:hover:bg-gray-700/50
               hover:border-gray-300 dark:hover:border-gray-600
               hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20
               focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30
               transition-all duration-200 cursor-pointer font-semibold"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {text}
    </button>
  );
};

export default GoogleLoginButton;