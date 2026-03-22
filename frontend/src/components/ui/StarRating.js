'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, onRate, readOnly = false, size = 20 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onRate && onRate(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            size={size}
            className={
              (hover || rating) >= star
                ? 'fill-earth-400 text-earth-400'
                : 'text-gray-600'
            }
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-400">({rating.toFixed(1)})</span>
      )}
    </div>
  );
}
