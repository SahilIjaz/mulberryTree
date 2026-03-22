'use client';

import { useAuth } from '@/context/AuthContext';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ChefHat, BookOpen, Calendar, Users, TrendingUp, Plus } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const getRoleGreeting = () => {
    switch (user?.role) {
      case 'chef': return "Ready to cook up something amazing?";
      case 'farmer': return "What's growing today?";
      case 'admin': return "Here's your community overview.";
      default: return "What would you like to explore?";
    }
  };

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-cream mb-1">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-400">{getRoleGreeting()}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<ChefHat />} label="My Recipes" value="0" color="mulberry" />
        <StatCard icon={<BookOpen />} label="My Courses" value="0" color="earth" />
        <StatCard icon={<Calendar />} label="My Events" value="0" color="forest" />
        <StatCard icon={<Users />} label="Community" value="Growing" color="gray" />
      </div>

      {/* Quick Actions */}
      <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6 mb-8">
        <h2 className="font-heading text-xl font-semibold text-cream mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {(user?.role === 'chef' || user?.role === 'admin') && (
            <>
              <Link href="/recipes/create">
                <Button variant="primary" size="sm">
                  <Plus size={16} /> New Recipe
                </Button>
              </Link>
              <Link href="/courses/create">
                <Button variant="secondary" size="sm">
                  <Plus size={16} /> New Course
                </Button>
              </Link>
            </>
          )}
          {(user?.role === 'farmer' || user?.role === 'chef' || user?.role === 'admin') && (
            <Link href="/events/create">
              <Button variant="forest" size="sm">
                <Plus size={16} /> New Event
              </Button>
            </Link>
          )}
          <Link href="/recipes">
            <Button variant="ghost" size="sm">Browse Recipes</Button>
          </Link>
          <Link href="/courses">
            <Button variant="ghost" size="sm">Browse Courses</Button>
          </Link>
          <Link href="/events">
            <Button variant="ghost" size="sm">Browse Events</Button>
          </Link>
        </div>
      </div>

      {/* Role Info */}
      <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6">
        <h2 className="font-heading text-xl font-semibold text-cream mb-3">Your Profile</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Role:</span>
            <Badge variant={user?.role === 'chef' ? 'mulberry' : user?.role === 'farmer' ? 'forest' : 'earth'}>
              {user?.role}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Email:</span>
            <span className="text-cream">{user?.email}</span>
          </div>
          {user?.location && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Location:</span>
              <span className="text-cream">{user?.location}</span>
            </div>
          )}
        </div>
        <Link href="/profile/edit" className="inline-block mt-4">
          <Button variant="ghost" size="sm">Edit Profile</Button>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    mulberry: 'border-mulberry-800/50 text-mulberry-400',
    earth: 'border-earth-700/50 text-earth-400',
    forest: 'border-forest-600/50 text-forest-400',
    gray: 'border-gray-700/50 text-gray-400',
  };

  return (
    <div className={`bg-charcoal-light border ${colors[color]} rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className={colors[color]}>{icon}</div>
        <TrendingUp size={16} className="text-gray-600" />
      </div>
      <div className="text-2xl font-bold text-cream">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}
