import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookUser, Mail, Lock, User as UserIcon, Sun, Moon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../context/ThemeContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/dashboard');
    } catch {
      // Errors handled by store
    }
  };

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

      <div className="w-full max-w-md space-y-8">
        
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-brand-600 rounded-xl text-white mb-4 shadow-lg shadow-brand-500/30">
            <BookUser className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-text">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <Card className="p-8 shadow-sm border-border bg-surface">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                required
                placeholder="Jane"
                icon={<UserIcon className="w-5 h-5" />}
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                label="Last Name"
                name="lastName"
                required
                placeholder="Doe"
                icon={<UserIcon className="w-5 h-5" />}
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              placeholder="jane@example.com"
              icon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={handleChange}
            />
            
            <p className="text-xs text-text-muted pt-1 pb-2">
              Must be at least 8 characters containing a number, an uppercase letter, and a special character.
            </p>

            <Button type="submit" className="w-full h-12 text-base shadow-sm" isLoading={isLoading}>
              Create account
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};