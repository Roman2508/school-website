import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { formatRichText } from "@/lib/utils";
import EventCard from "../features/event.card";
import type { EventsFeedData, EventPost } from "@/types/strapi";

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
              <span className="text-dark">{formatRichText(feed.title)}</span>
            </h2>
            {feed.subtitle && (
              <p className="text-lg text-[hsl(0_0%_40%)] max-w-xl">
                {feed.subtitle}
              </p>
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
