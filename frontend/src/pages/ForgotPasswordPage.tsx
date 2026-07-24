import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookUser, Mail } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword, isLoading } = useAuthStore();
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-brand-600 rounded-xl text-white mb-4 shadow-lg shadow-brand-500/30">
            <BookUser className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Reset Password</h2>
        </div>

        <Card className="p-8">
          {submitted ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly. (Check your backend console for the mock email!)
              </p>
              <Link to="/login" className="block w-full">
                <Button className="w-full" variant="outline">Back to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>
              <Input
                label="Email Address"
                type="email"
                required
                icon={<Mail className="w-5 h-5" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>Send Reset Link</Button>
              <div className="text-center text-sm">
                <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">Back to Login</Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};