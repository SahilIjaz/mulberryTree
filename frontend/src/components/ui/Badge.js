import { cn } from '@/lib/utils';

const variants = {
  mulberry: 'bg-mulberry-900/50 text-mulberry-300 border-mulberry-800',
  forest: 'bg-forest-700/50 text-forest-300 border-forest-600',
  earth: 'bg-earth-800/50 text-earth-300 border-earth-700',
  gray: 'bg-gray-800/50 text-gray-300 border-gray-700',
  red: 'bg-red-900/50 text-red-300 border-red-800',
};

export default function Badge({ children, variant = 'mulberry', className }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
