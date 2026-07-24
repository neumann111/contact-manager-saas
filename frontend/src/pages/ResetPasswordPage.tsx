import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookUser, Lock, Sun, Moon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await resetPassword(token, password);
      navigate('/dashboard');
    } catch {
      // Error handled in store
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
            Create new password
          </h2>
        </div>

        <Card className="p-8 shadow-sm border-border bg-surface">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              required
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              label="Confirm New Password"
              type="password"
              required
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" className="w-full h-12 text-base shadow-sm" isLoading={isLoading}>
              Secure my account
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};