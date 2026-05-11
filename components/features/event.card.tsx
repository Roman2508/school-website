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
    <div className="bg-white rounded-2xl border border-[hsl(80_15%_88%)] p-4 sm:p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 group cursor-pointer flex items-start gap-4 sm:gap-5">
      <div
        className={`${CARD_COLORS[colorIdx % CARD_COLORS.length]} rounded-xl min-w-16 h-16 sm:min-w-[72px] sm:h-[72px] flex flex-col items-center justify-center text-white flex-shrink-0`}
      >
        <span className="text-xl sm:text-2xl font-black leading-none">{day}</span>
        <span className="text-[10px] font-bold tracking-wider mt-0.5">
          {month}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-heading font-bold text-sm sm:text-base leading-snug break-words mb-1 group-hover:text-[hsl(84_55%_45%)] transition-colors text-[hsl(0_0%_21%)]">
          {event.title}
        </h3>
        <div className="mt-2 flex flex-col gap-1 text-xs text-[hsl(0_0%_40%)] sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1">
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(event.date)}
            {event.end_date && ` - ${formatTime(event.end_date)}`}
          </span>
          {event.location && (
            <span className="flex min-w-0 items-start gap-1">
              <MapPin className="w-3.5 h-3.5 mt-px shrink-0" />
              <span className="break-words">{event.location}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
