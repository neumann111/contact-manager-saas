import React from 'react';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-brand-600 border-t-transparent`}
      />
    </div>
  );
};