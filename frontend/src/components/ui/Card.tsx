import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={twMerge(
        clsx(
          'overflow-hidden rounded-2xl border border-border bg-surface shadow-sm backdrop-blur-sm transition-all duration-300 ease-out',
          onClick && [
            'cursor-pointer',
            'hover:-translate-y-1.5',
            'hover:border-brand-500',
            'hover:shadow-lg',
            'hover:ring-4',
            'hover:ring-brand-500/10',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-brand-500/50',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-surface',
            'active:translate-y-0',
            'active:shadow-md',
            'active:ring-brand-500/5',
          ],
          className
        )
      )}
    >
      {children}
    </div>
  );
};