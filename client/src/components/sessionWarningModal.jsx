import { useEffect, useState } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SessionWarningModal = () => {
  const { showInactivityWarning, dismissWarning } = useAuth();
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!showInactivityWarning) {
      setCountdown(60);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showInactivityWarning]);

  if (!showInactivityWarning) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm 
                flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-warning-title"
    >
      <div className="relative bg-gradient-to-br from-white to-gray-50/50 
                    dark:from-gray-800 dark:to-gray-800/50
                    rounded-2xl p-6 max-w-md w-full
                    shadow-2xl shadow-gray-900/10 dark:shadow-black/40
                    border-2 border-amber-200/60 dark:border-amber-700/60
                    overflow-hidden
                    animate-slideIn">

        {/* Background gradient accent */}
        <div className="absolute top-0 right-0 w-32 h-32 
                      bg-gradient-to-br from-amber-500/10 to-orange-500/10
                      dark:from-amber-500/20 dark:to-orange-500/20
                      rounded-full blur-3xl -z-0" />

        <div className="relative z-10">
          {/* Icon and Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full 
                          bg-amber-100 dark:bg-amber-900/30
                          flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h2
                id="session-warning-title"
                className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1"
              >
                Still there?
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You'll be logged out due to inactivity
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="mb-6 p-4 rounded-xl
                        bg-gradient-to-br from-amber-50 to-orange-50/50
                        dark:from-amber-900/20 dark:to-orange-900/10
                        border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="text-2xl font-bold text-amber-900 dark:text-amber-200 tabular-nums">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
            <p className="text-xs text-center text-amber-700 dark:text-amber-300 mt-2">
              Time remaining
            </p>
          </div>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center leading-relaxed">
            Click below to stay logged in and continue your session.
          </p>

          {/* Button */}
          <button
            onClick={dismissWarning}
            className="w-full py-3 rounded-xl
                     bg-gradient-to-r from-amber-500 to-orange-500
                     dark:from-amber-600 dark:to-orange-600
                     text-white font-semibold text-sm
                     hover:shadow-lg hover:shadow-amber-500/30 dark:hover:shadow-amber-500/40
                     hover:scale-[1.02]
                     focus:outline-none focus:ring-4 focus:ring-amber-100 dark:focus:ring-amber-900/30
                     transition-all duration-200 cursor-pointer"
            autoFocus
          >
            Continue Session
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SessionWarningModal;