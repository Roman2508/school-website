import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"
import { getStrapiMedia } from "@/lib/strapi"
import type { NewsFeedData, NewsPost } from "@/types/strapi"
import { formatRichText } from "@/lib/utils"

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function NewsCard({ post }: { post: NewsPost }) {
  const imageUrl = getStrapiMedia(post.main_photo?.url)

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
  )
}

interface Props {
  feed: NewsFeedData
  posts: NewsPost[]
}

export default function NewsSectionWrapper({ feed, posts }: Props) {
  if (posts.length === 0) return null

  return (
    <section id="news" className="py-20 md:py-28">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black mb-3 text-[hsl(0_0%_21%)]">
              <span className="text-dark">{formatRichText(feed.title)}</span>
            </h2>
            {feed.subtitle && <p className="text-lg text-[hsl(0_0%_40%)] max-w-xl">{feed.subtitle}</p>}
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
  )
}
