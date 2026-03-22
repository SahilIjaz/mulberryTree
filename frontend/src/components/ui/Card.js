import { cn } from '@/lib/utils';

export default function Card({ children, className, hover = true, ...props }) {
  return (
    <div
      className={cn(
        'bg-charcoal-light border border-gray-800 rounded-xl overflow-hidden',
        hover && 'hover:border-mulberry-800 hover:shadow-lg hover:shadow-mulberry-950/20 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardImage({ src, alt, className }) {
  return (
    <div className={cn('relative h-48 bg-charcoal-lighter overflow-hidden', className)}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-600">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}

export function CardBody({ children, className }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return (
    <div className={cn('px-5 py-3 border-t border-gray-800 flex items-center justify-between', className)}>
      {children}
    </div>
  );
}
