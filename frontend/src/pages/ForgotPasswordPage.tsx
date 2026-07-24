import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookUser, Mail, ArrowLeft, Sun, Moon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../context/ThemeContext';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword, isLoading } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSubmitted(true);
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
            Reset password
          </h2>
        </div>

        <Card className="p-8 shadow-sm border-border bg-surface">
          {submitted ? (
            <div className="text-center space-y-6">
              <div className="p-4 bg-brand-500/10 rounded-xl border border-brand-500/20">
                <p className="text-sm text-brand-600 dark:text-brand-400">
                  If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
                </p>
              </div>
              <Link to="/login" className="block w-full">
                <Button className="w-full h-12" variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-text-muted">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="you@example.com"
                icon={<Mail className="w-5 h-5" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full h-12 text-base shadow-sm" isLoading={isLoading}>
                Send Reset Link
              </Button>
              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};