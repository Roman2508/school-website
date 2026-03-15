import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import type { EventsFeedData, EventPost } from "@/types/strapi";

const MONTH_SHORT: Record<number, string> = {
  0: "СІЧ", 1: "ЛЮТ", 2: "БЕР", 3: "КВІ", 4: "ТРА", 5: "ЧЕР",
  6: "ЛИП", 7: "СЕР", 8: "ВЕР", 9: "ЖОВ", 10: "ЛИС", 11: "ГРУ",
};

const CARD_COLORS = [
  "bg-[hsl(84_55%_45%)]",
  "bg-[hsl(50_100%_50%)]",
  "bg-[hsl(45_99%_47%)]",
  "bg-[hsl(84_55%_38%)]",
];

function EventCard({ event, colorIdx }: { event: EventPost; colorIdx: number }) {
  const date = new Date(event.date);
  const day = date.getDate().toString().padStart(2, "0");
  const month = MONTH_SHORT[date.getMonth()];

  const formatTime = (dt: string) =>
    new Date(dt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-white rounded-2xl border border-[hsl(80_15%_88%)] p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 group cursor-pointer flex gap-5">
      <div
        className={`${CARD_COLORS[colorIdx % CARD_COLORS.length]} rounded-xl min-w-[72px] h-[72px] flex flex-col items-center justify-center text-white flex-shrink-0`}
      >
        <span className="text-2xl font-black leading-none">{day}</span>
        <span className="text-[10px] font-bold tracking-wider mt-0.5">{month}</span>
      </div>
      <div className="min-w-0">
        <h3 className="font-heading font-bold text-base mb-1 group-hover:text-[hsl(84_55%_45%)] transition-colors truncate text-[hsl(0_0%_21%)]">
          {event.title}
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[hsl(0_0%_40%)] mt-2">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(event.date)}
            {event.end_date && ` – ${formatTime(event.end_date)}`}
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

interface Props {
  feed: EventsFeedData;
  events: EventPost[];
}

export default function EventsSectionWrapper({ feed, events }: Props) {
  if (events.length === 0) return null;

  return (
    <section id="events" className="py-20 md:py-28 bg-[hsl(80_30%_93%/0.3)]">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black mb-3 text-[hsl(0_0%_21%)]">
              <span className="text-gradient-primary">{feed.title}</span>
            </h2>
            {feed.subtitle && (
              <p className="text-lg text-[hsl(0_0%_40%)] max-w-xl">{feed.subtitle}</p>
            )}
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-[hsl(84_55%_45%)] font-semibold hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            {feed.all_link_label} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} colorIdx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
