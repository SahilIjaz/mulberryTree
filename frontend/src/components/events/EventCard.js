import Link from 'next/link';
import Card, { CardImage, CardBody, CardFooter } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getImageUrl, formatDate } from '@/lib/utils';
import { MapPin, Calendar, Users } from 'lucide-react';

const typeVariant = {
  workshop: 'mulberry', market: 'forest', harvest: 'earth', tasting: 'mulberry', other: 'gray',
};

export default function EventCard({ event }) {
  return (
    <Link href={`/events/${event._id}`}>
      <Card className="relative">
        <CardImage src={getImageUrl(event.image)} alt={event.title} />
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-mulberry-900/90 backdrop-blur-sm text-cream rounded-lg px-3 py-1.5 text-center">
            <div className="text-xs uppercase font-medium">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
            <div className="text-xl font-bold">{new Date(event.date).getDate()}</div>
          </div>
        </div>
        <CardBody>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={typeVariant[event.eventType]}>{event.eventType}</Badge>
            {event.isFree && <Badge variant="forest">Free</Badge>}
          </div>
          <h3 className="text-lg font-heading font-semibold text-cream mb-2">
            {event.title}
          </h3>
          <div className="space-y-1 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-mulberry-400" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-mulberry-400" />
              {event.location}
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Users size={14} />
            {event.attendees?.length || 0} attending
          </span>
          {!event.isFree && (
            <span className="text-mulberry-400 font-semibold">${event.price}</span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
