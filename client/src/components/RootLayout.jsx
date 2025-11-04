import { useMemo, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import Header from "./Header";
import Footer from "./Footer";
import SessionWarningModal from "./sessionWarningModal";
import ScrollToTop from './ScrollToTop';

// QueryClient with auth integration
const QueryClientWithAuth = ({ children }) => {
  const { handleSessionExpired, resetInactivityTimer } = useAuth();
  const handleSessionExpiredRef = useRef(handleSessionExpired);
  const resetInactivityTimerRef = useRef(resetInactivityTimer);

  // Keep refs up to date without causing re-renders
  useEffect(() => {
    handleSessionExpiredRef.current = handleSessionExpired;
    resetInactivityTimerRef.current = resetInactivityTimer;
  }, [handleSessionExpired, resetInactivityTimer]);

  // Create QueryClient once with stable callbacks using refs
  const queryClient = useMemo(() => {
    return new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => {
          if (error?.status === 401 || error?.response?.status === 401) {
            handleSessionExpiredRef.current(error?.message || 'Your session has expired.');
          }
        },
        onSuccess: () => {
          resetInactivityTimerRef.current();
        }
      }),
      mutationCache: new MutationCache({
        onError: (error) => {
          if (error?.status === 401 || error?.response?.status === 401) {
            handleSessionExpiredRef.current(error?.message || 'Your session has expired.');
          }
        },
        onSuccess: () => {
          resetInactivityTimerRef.current();
        }
      }),
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: (failureCount, error) => {
            if (error?.status === 401 || error?.response?.status === 401) {
              return false;
            }
            return failureCount < 3;
          },
          structuralSharing: false,
        },
      },
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export const RootLayout = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryClientWithAuth>
          <ScrollToTop />
          <div className="min-h-screen bg-gray-100
                        bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20
                        dark:from-gray-900 dark:via-gray-900 dark:to-gray-800
                        transition-colors duration-200 
                        flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Outlet />
            </main>
            <Footer />
            <SessionWarningModal />
          </div>
        </QueryClientWithAuth>
      </ThemeProvider>
    </AuthProvider>
  );
};