// src/components/RootLayout.jsx
import { Outlet } from 'react-router-dom';
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./Header";
import Footer from "./Footer";

const queryClient = new QueryClient();

export const RootLayout = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
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