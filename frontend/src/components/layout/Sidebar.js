'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, ChefHat, BookOpen, Calendar,
  User, Plus, Tractor
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  if (user?.role === 'chef' || user?.role === 'admin') {
    links.push(
      { href: '/recipes/create', label: 'New Recipe', icon: Plus },
      { href: '/courses/create', label: 'New Course', icon: BookOpen },
    );
  }

  if (user?.role === 'farmer' || user?.role === 'chef' || user?.role === 'admin') {
    links.push(
      { href: '/events/create', label: 'New Event', icon: Calendar },
    );
  }

  return (
    <aside className="w-64 bg-charcoal-light border-r border-gray-800 min-h-[calc(100vh-4rem)] p-4 hidden lg:block">
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-mulberry-900/30 text-mulberry-300 border border-mulberry-800/50'
                  : 'text-gray-400 hover:text-cream hover:bg-charcoal'
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
