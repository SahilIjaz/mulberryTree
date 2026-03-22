'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createEvent } from '@/lib/api';
import Input, { Textarea, Select } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { EVENT_TYPES } from '@/lib/constants';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', eventType: 'other', date: '', endDate: '',
    location: '', maxAttendees: '', isFree: true, price: '0',
  });
  const [image, setImage] = useState(null);

  if (user?.role !== 'chef' && user?.role !== 'farmer' && user?.role !== 'admin') {
    return <div className="text-center py-20 text-gray-400">Only chefs and farmers can create events</div>;
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== '' && val !== undefined) fd.append(key, val);
      });
      if (image) fd.append('image', image);

      await createEvent(fd);
      toast.success('Event created!');
      router.push('/events');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-3xl font-bold text-cream mb-8">Create Event</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6 space-y-4">
          <Input label="Event Title" name="title" value={formData.title} onChange={handleChange} placeholder="Event name" required />
          <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Tell people about this event" required />

          <Select label="Event Type" name="eventType" value={formData.eventType} onChange={handleChange}
            options={EVENT_TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date & Time" name="date" type="datetime-local" value={formData.date} onChange={handleChange} required />
            <Input label="End Date & Time" name="endDate" type="datetime-local" value={formData.endDate} onChange={handleChange} />
          </div>

          <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="Event venue or address" required />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Max Attendees (0 = unlimited)" name="maxAttendees" type="number" value={formData.maxAttendees} onChange={handleChange} />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-cream-dark">Pricing</label>
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-600 text-mulberry-600 focus:ring-mulberry-800" />
                  Free Event
                </label>
              </div>
              {!formData.isFree && (
                <Input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price ($)" />
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-cream-dark">Image</label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-700 rounded-lg p-6 cursor-pointer hover:border-mulberry-800 transition-colors">
              <Upload size={20} className="text-gray-500" />
              <span className="text-gray-400 text-sm">{image ? image.name : 'Click to upload'}</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </label>
          </div>
        </div>

        <Button type="submit" isLoading={loading} className="w-full" size="lg">
          Publish Event
        </Button>
      </form>
    </div>
  );
}
