import { Outlet } from 'react-router-dom';
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { HelmetProvider } from 'react-helmet-async';
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
          {/* <HelmetProvider prioritizeSeoTags> */}
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
              </main>
              <Footer />
            </div>
          {/* </HelmetProvider> */}
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};