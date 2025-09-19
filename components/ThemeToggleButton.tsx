import React from 'react';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

type Theme = 'light' | 'dark';

interface ThemeToggleButtonProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-sm font-medium text-gray-700 bg-white/50 rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

export default ThemeToggleButton;
