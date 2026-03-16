import Link from "next/link";
import { ArrowRight } from "lucide-react";

import NewsCard from "../features/news-card";
import { formatRichText } from "@/lib/utils";
import type { NewsFeedData, NewsPost } from "@/types/strapi";

interface Props {
  feed: NewsFeedData;
  posts: NewsPost[];
}

export default function NewsSectionWrapper({ feed, posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section id="news" className="py-20 md:py-28">
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
            href="/news"
            className="inline-flex items-center gap-2 text-[hsl(84_55%_45%)] font-semibold hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            {feed.all_link_label} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
