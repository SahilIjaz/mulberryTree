import { cn, getInitials, getImageUrl } from '@/lib/utils';

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-xl',
};

export default function Avatar({ name, src, size = 'md', className }) {
  return (
    <div className={cn(
      'rounded-full flex items-center justify-center font-semibold overflow-hidden',
      'bg-gradient-to-br from-mulberry-800 to-mulberry-950 text-mulberry-200',
      sizes[size],
      className
    )}>
      {src ? (
        <img src={getImageUrl(src)} alt={name} className="w-full h-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}
