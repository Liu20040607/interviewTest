import { useState } from "react";
import { Star } from "lucide-react";
import type { Rating } from "../../schemas/chat";

export function StarRating({
  value,
  onChange,
}: {
  value: Rating;
  onChange: (r: Rating) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value ?? 0;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(value === star ? null : (star as Rating))}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className="p-0.5 transition-transform hover:scale-110"
          title={`${star} 星`}
        >
          <Star
            size={16}
            className={
              star <= display
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
      {value && <span className="ml-1 text-xs text-gray-400">{value}/5</span>}
    </div>
  );
}
