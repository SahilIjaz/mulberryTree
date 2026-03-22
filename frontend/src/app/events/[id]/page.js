'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getEventById, attendEvent, unattendEvent } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getImageUrl, formatDateTime } from '@/lib/utils';
import { MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EventDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);

  useEffect(() => { fetchEvent(); }, [id]);

  const fetchEvent = async () => {
    try {
      const data = await getEventById(id);
      setEvent(data.event);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isAttending = event?.attendees?.some(a => a === user?.id || a?._id === user?.id);

  const handleAttend = async () => {
    if (!isAuthenticated) return toast.error('Please login first');
    setAttending(true);
    try {
      if (isAttending) {
        await unattendEvent(id);
        setEvent(prev => ({
          ...prev,
          attendees: prev.attendees.filter(a => a !== user.id && a?._id !== user.id),
        }));
        toast.success('Removed from event');
      } else {
        await attendEvent(id);
        setEvent(prev => ({
          ...prev,
          attendees: [...(prev.attendees || []), user.id],
        }));
        toast.success('Registered for event!');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAttending(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!event) return <div className="text-center py-20 text-gray-400">Event not found</div>;

  const typeVariant = { workshop: 'mulberry', market: 'forest', harvest: 'earth', tasting: 'mulberry', other: 'gray' };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {event.image && (
        <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden mb-8">
          <img src={getImageUrl(event.image)} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        </div>
      )}

      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={typeVariant[event.eventType]}>{event.eventType}</Badge>
            <Badge variant={event.status === 'upcoming' ? 'forest' : event.status === 'cancelled' ? 'red' : 'gray'}>
              {event.status}
            </Badge>
            {event.isFree && <Badge variant="forest">Free</Badge>}
          </div>
          <h1 className="font-heading text-3xl font-bold text-cream mb-3">{event.title}</h1>
        </div>
        <Button onClick={handleAttend} isLoading={attending} variant={isAttending ? 'secondary' : 'primary'} size="lg">
          {isAttending ? 'Cancel Attendance' : 'Attend Event'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-charcoal-light border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <Calendar className="text-mulberry-400" size={24} />
          <div>
            <div className="text-sm text-gray-400">Date & Time</div>
            <div className="text-cream">{formatDateTime(event.date)}</div>
            {event.endDate && <div className="text-gray-400 text-sm">to {formatDateTime(event.endDate)}</div>}
          </div>
        </div>
        <div className="bg-charcoal-light border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <MapPin className="text-forest-400" size={24} />
          <div>
            <div className="text-sm text-gray-400">Location</div>
            <div className="text-cream">{event.location}</div>
          </div>
        </div>
        <div className="bg-charcoal-light border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <Users className="text-earth-400" size={24} />
          <div>
            <div className="text-sm text-gray-400">Attendees</div>
            <div className="text-cream">
              {event.attendees?.length || 0}
              {event.maxAttendees > 0 && ` / ${event.maxAttendees}`}
            </div>
          </div>
        </div>
        <div className="bg-charcoal-light border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <DollarSign className="text-mulberry-400" size={24} />
          <div>
            <div className="text-sm text-gray-400">Price</div>
            <div className="text-cream">{event.isFree ? 'Free' : `$${event.price}`}</div>
          </div>
        </div>
      </div>

      <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6 mb-8">
        <h2 className="font-heading text-xl font-semibold text-cream mb-3">About this event</h2>
        <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
      </div>

      <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6">
        <h2 className="font-heading text-xl font-semibold text-cream mb-3">Organizer</h2>
        <div className="flex items-center gap-3">
          <Avatar name={event.organizer?.name} src={event.organizer?.avatar} size="lg" />
          <div>
            <div className="text-cream font-medium text-lg">{event.organizer?.name}</div>
            {event.organizer?.bio && <p className="text-gray-400 text-sm mt-1">{event.organizer.bio}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
