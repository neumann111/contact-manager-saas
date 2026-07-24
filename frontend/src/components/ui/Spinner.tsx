import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={twMerge(
        clsx(
          'flex items-center justify-center py-4',
          className
        )
      )}
    >
      <div
        className={clsx(
          'animate-spin rounded-full border-brand-600 border-t-transparent',
          'transition-colors duration-200',
          sizeClasses[size]
        )}
      />
    </div>
  );
};