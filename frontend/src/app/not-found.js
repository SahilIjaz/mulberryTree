import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-heading font-bold text-mulberry-400 mb-4">404</h1>
        <p className="text-xl text-cream mb-2">Page Not Found</p>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/"><Button>Back to Home</Button></Link>
      </div>
    </div>
  );
}
