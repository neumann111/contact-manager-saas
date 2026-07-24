import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sun, Moon, LogOut, User as UserIcon, 
  LayoutDashboard, Users, FolderKanban, Menu, X, BookUser
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Contacts', path: '/contacts', icon: <Users className="w-4 h-4" /> },
    { name: 'Categories', path: '/categories', icon: <FolderKanban className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-surface/80 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 group focus:outline-none">
              <div className="p-1.5 bg-brand-600 rounded-lg text-white shadow-sm group-hover:bg-brand-500 transition-colors">
                <BookUser className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-text hidden sm:block tracking-tight">
                ContactManager
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50
                    ${isActive(link.path) 
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20' 
                      : 'text-text-muted hover:bg-surface-secondary hover:text-text'
                    }
                  `}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-text-muted hover:bg-surface-secondary hover:text-text transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="hidden sm:block h-6 w-px bg-border mx-1" />

            <button
              onClick={() => navigate('/profile')}
              aria-label="Profile Settings"
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-border" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm border border-brand-500/20">
                  {user?.firstName?.charAt(0) || <UserIcon className="w-4 h-4" />}
                </div>
              )}
            </button>

            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-danger/50"
            >
              <LogOut className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="md:hidden p-2 text-text-muted hover:bg-surface-secondary hover:text-text rounded-xl transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <nav className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors
                  ${isActive(link.path) 
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20' 
                    : 'text-text-muted hover:bg-surface-secondary hover:text-text'
                  }
                `}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};