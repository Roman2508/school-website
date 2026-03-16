import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { getStrapiMedia } from "@/lib/strapi";
import type { NewsPost } from "@/types/strapi";

export default function NewsCard({ post }: { post: NewsPost }) {
  const imageUrl = getStrapiMedia(post.main_photo?.url);

  return (
    <article className="bg-white rounded-2xl border border-[hsl(80_15%_88%)] overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 group cursor-pointer">
      <Link href={`/news/${post.slug}`}>
        <div className="relative overflow-hidden aspect-[3/2]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.main_photo?.alternativeText ?? post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-[hsl(80_30%_93%)] flex items-center justify-center">
              <span className="text-[hsl(84_55%_45%)] text-4xl">📰</span>
            </div>
          )}
          {post.category && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-[hsl(210_80%_92%)] text-[hsl(86_50%_26%)]">
              {post.category.name}
            </span>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-[hsl(0_0%_40%)] mb-2">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.date)}
          </div>
          <h3 className="font-heading font-bold text-base mb-2 line-clamp-2 group-hover:text-[hsl(84_55%_45%)] transition-colors text-[hsl(0_0%_21%)]">
            {post.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}
