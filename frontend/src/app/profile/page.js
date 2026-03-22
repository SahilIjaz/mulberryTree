'use client';

import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MapPin, Mail, Edit } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!user) return null;

  const roleVariant = { chef: 'mulberry', farmer: 'forest', user: 'earth', admin: 'gray' };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-charcoal-light border border-gray-800 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="h-32 bg-gradient-to-r from-mulberry-900/50 to-forest-900/50" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <Avatar name={user.name} src={user.avatar} size="xl" className="border-4 border-charcoal-light" />
            <Link href="/profile/edit">
              <Button variant="secondary" size="sm"><Edit size={16} /> Edit Profile</Button>
            </Link>
          </div>
          <h1 className="font-heading text-2xl font-bold text-cream">{user.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={roleVariant[user.role]}>{user.role}</Badge>
          </div>

          {user.bio && <p className="text-gray-300 mt-4">{user.bio}</p>}

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Mail size={16} /> {user.email}
            </div>
            {user.location && (
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} /> {user.location}
              </div>
            )}
          </div>

          {user.role === 'chef' && user.specialties?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm text-gray-400 mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {user.specialties.map((s, i) => <Badge key={i} variant="mulberry">{s}</Badge>)}
              </div>
            </div>
          )}

          {user.role === 'farmer' && user.farmName && (
            <div className="mt-4">
              <h3 className="text-sm text-gray-400 mb-1">Farm</h3>
              <p className="text-cream">{user.farmName}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
