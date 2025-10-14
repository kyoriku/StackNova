// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage, default to 'auto'
  const [theme, setThemeState] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // If no saved theme or saved theme is not one of our valid options, default to 'auto'
    if (!savedTheme || !['light', 'dark', 'auto'].includes(savedTheme)) {
      return 'auto';
    }
    return savedTheme;
  });

  // Function to update the DOM and localStorage
  const updateDOM = (currentTheme) => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Determine if dark mode should be applied
    const shouldBeDark =
      currentTheme === 'dark' ||
      (currentTheme === 'auto' && systemPrefersDark);

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Public function to change theme
  const setTheme = (newTheme) => {
    if (!['light', 'dark', 'auto'].includes(newTheme)) {
      console.warn(`Invalid theme: ${newTheme}. Must be 'light', 'dark', or 'auto'.`);
      return;
    }

    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
    updateDOM(newTheme);
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    updateDOM(theme);
  }, [theme]);

  // Listen for system theme changes (only matters when theme is 'auto')
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = () => {
      // Only update if we're in auto mode
      if (theme === 'auto') {
        updateDOM('auto');
      }
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};