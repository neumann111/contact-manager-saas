import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex w-full flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="pointer-events-none absolute left-3 text-text-muted">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              clsx(
                'w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-text shadow-sm transition-all duration-200',
                'focus:outline-none focus:ring-2',
                'disabled:cursor-not-allowed disabled:opacity-60',
                icon ? 'pl-10' : '',
                error
                  ? 'border-danger focus:border-danger focus:ring-danger/20'
                  : 'border-border focus:border-brand-500 focus:ring-brand-500/20',
                className
              )
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';