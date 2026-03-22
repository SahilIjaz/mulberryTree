'use client';

import { cn } from '@/lib/utils';

export default function Input({
  label, error, icon, type = 'text', className, ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-cream-dark">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'w-full bg-charcoal border border-gray-700 rounded-lg px-4 py-2.5 text-cream',
            'placeholder-gray-500 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-mulberry-800 focus:border-mulberry-800',
            icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-cream-dark">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full bg-charcoal border border-gray-700 rounded-lg px-4 py-2.5 text-cream',
          'placeholder-gray-500 transition-all duration-200 min-h-[100px] resize-y',
          'focus:outline-none focus:ring-2 focus:ring-mulberry-800 focus:border-mulberry-800',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

export function Select({ label, error, options, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-cream-dark">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full bg-charcoal border border-gray-700 rounded-lg px-4 py-2.5 text-cream',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-mulberry-800 focus:border-mulberry-800',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
