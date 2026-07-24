import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore'; // IMPORTED ZUSTAND STORE

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuthStore(); // DESTRUCTURED LOGOUT FUNCTION

  const handleLogout = () => {
    logout(); // CLEARS STATE AND TOKENS
    navigate('/login'); // REDIRECTS TO LOGIN
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 hidden sm:block">
          Contact Platform
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-sm">
            <UserIcon className="w-4 h-4" />
          </div>
        </button>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 dark:text-gray-400 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};