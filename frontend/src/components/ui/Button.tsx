import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-surface active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 rounded-xl';

  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700 focus:ring-brand-500 shadow-sm',
    secondary: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 active:bg-brand-500/30 focus:ring-brand-500 border border-brand-500/20',
    outline: 'border border-border text-text hover:bg-surface-secondary hover:border-border-strong active:bg-surface-tertiary focus:ring-border',
    ghost: 'text-text-muted hover:bg-surface-secondary hover:text-text active:bg-surface-tertiary focus:ring-border',
    danger: 'bg-danger text-white hover:bg-danger/90 active:bg-danger/80 focus:ring-danger shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && children}
    </button>
  );
};