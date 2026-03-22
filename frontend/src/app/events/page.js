'use client';

import { useState, useEffect } from 'react';
import { getEvents } from '@/lib/api';
import EventCard from '@/components/events/EventCard';
import Pagination from '@/components/ui/Pagination';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { Search } from 'lucide-react';
import { EVENT_TYPES } from '@/lib/constants';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [eventType, setEventType] = useState('');
  const [upcoming, setUpcoming] = useState(true);

  useEffect(() => { fetchEvents(); }, [page, eventType, upcoming]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.set('search', search);
      if (eventType) params.set('eventType', eventType);
      if (upcoming) params.set('upcoming', 'true');

      const data = await getEvents(params.toString());
      setEvents(data.events);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-cream mb-2">Events</h1>
        <p className="text-gray-400">Discover workshops, markets, and food events near you</p>
      </div>

      <div className="bg-charcoal-light border border-gray-800 rounded-xl p-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchEvents(); }}>
              <Input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search size={18} />} />
            </form>
          </div>
          <Select value={eventType} onChange={(e) => { setEventType(e.target.value); setPage(1); }}
            options={[{ value: '', label: 'All Types' }, ...EVENT_TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))]} />
          <div className="flex gap-2">
            <Button variant={upcoming ? 'primary' : 'ghost'} size="sm" onClick={() => { setUpcoming(true); setPage(1); }} className="flex-1">
              Upcoming
            </Button>
            <Button variant={!upcoming ? 'primary' : 'ghost'} size="sm" onClick={() => { setUpcoming(false); setPage(1); }} className="flex-1">
              All
            </Button>
          </div>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : events.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No events found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => <EventCard key={event._id} event={event} />)}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
