import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';

export const NotFoundPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-surface-secondary text-text transition-colors duration-200">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2.5 rounded-xl bg-surface border border-border text-text-muted hover:text-text hover:bg-surface-secondary shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <Card className="max-w-md w-full p-8 text-center shadow-sm border-border bg-surface">
        <h1 className="text-4xl font-bold mb-2 text-text">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-text">Page Not Found</h2>
        <p className="text-text-muted mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-card transition-all duration-200 hover:bg-brand-700 hover:shadow-card-hover active:bg-brand-800 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          Go to Dashboard
        </Link>
      </Card>
    </div>
  );
};