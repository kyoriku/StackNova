import { Outlet } from 'react-router-dom';
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./Header";
import Footer from "./Footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      // Ensure query key changes trigger refetch
      structuralSharing: false
    },
  },
});

export const RootLayout = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
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
          </div>
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};