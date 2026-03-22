import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date) {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatDateTime(date) {
  return format(new Date(date), 'MMM dd, yyyy h:mm a');
}

export function timeAgo(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function truncateText(text, length = 150) {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function getImageUrl(path) {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `http://localhost:5000${path}`;
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getRoleBadgeColor(role) {
  const colors = {
    chef: 'bg-mulberry-900 text-mulberry-100',
    farmer: 'bg-forest-700 text-forest-100',
    user: 'bg-earth-700 text-earth-100',
    admin: 'bg-charcoal-lighter text-cream',
  };
  return colors[role] || colors.user;
}
