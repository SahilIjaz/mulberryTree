'use client';

import { cn } from '@/lib/utils';

const variants = {
  primary: 'bg-gradient-to-r from-mulberry-800 to-mulberry-900 hover:from-mulberry-700 hover:to-mulberry-800 text-white',
  secondary: 'border-2 border-earth-600 text-earth-400 hover:bg-earth-600 hover:text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'text-cream hover:bg-charcoal-lighter',
  forest: 'bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-500 hover:to-forest-600 text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3 text-lg',
};

export default function Button({
  children, variant = 'primary', size = 'md', className,
  isLoading, disabled, ...props
}) {
  return (
    <button
      className={cn(
        'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        (disabled || isLoading) && 'opacity-60 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
