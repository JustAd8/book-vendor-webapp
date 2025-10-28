import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-600"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Sun className="w-6 h-6 text-yellow-500" />
      ) : (
        <Moon className="w-6 h-6 text-indigo-600" />
      )}
    </button>
  );
};

export default DarkModeToggle;
