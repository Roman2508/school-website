import { MapPin, Clock } from "lucide-react";

import type { EventPost } from "@/types/strapi";
import { CARD_COLORS, MONTH_SHORT } from "@/lib/constants";

export default function EventCard({
  event,
  colorIdx,
}: {
  event: EventPost;
  colorIdx: number;
}) {
  const date = new Date(event.date);
  const day = date.getDate().toString().padStart(2, "0");
  const month = MONTH_SHORT[date.getMonth()];

  const formatTime = (dt: string) =>
    new Date(dt).toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-white rounded-2xl border border-[hsl(80_15%_88%)] p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 group cursor-pointer flex gap-5">
      <div
        className={`${CARD_COLORS[colorIdx % CARD_COLORS.length]} rounded-xl min-w-[72px] h-[72px] flex flex-col items-center justify-center text-white flex-shrink-0`}
      >
        <span className="text-2xl font-black leading-none">{day}</span>
        <span className="text-[10px] font-bold tracking-wider mt-0.5">
          {month}
        </span>
      </div>
      <div className="min-w-0">
        <h3 className="font-heading font-bold text-base mb-1 group-hover:text-[hsl(84_55%_45%)] transition-colors truncate text-[hsl(0_0%_21%)]">
          {event.title}
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[hsl(0_0%_40%)] mt-2">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(event.date)}
            {event.end_date && ` - ${formatTime(event.end_date)}`}
          </span>
          {event.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {event.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
