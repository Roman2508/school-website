import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

import ArchiveSelect from "@/components/pages/news/ArchiveSelect";
import NewsGallery from "@/components/pages/news/NewsGallery";
import RichTextContent from "@/components/blocks/RichTextContent";
import { getLatestNews, getNewsArchiveMonths, getNewsBySlug } from "@/lib/api/news";
import { formatDate } from "@/lib/utils";
import { getStrapiMedia } from "@/lib/strapi";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) {
    return { title: "Новина" };
  }
  return {
    title: post.title,
    description: typeof post.body === "string" ? post.body.slice(0, 160) : undefined,
  };
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);

  if (!post) {
    notFound();
  }

  const [latestNews, archiveMonths] = await Promise.all([
    getLatestNews(5),
    getNewsArchiveMonths(),
  ]);

  const imageUrl = getStrapiMedia(post.main_photo?.url);

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(84_55%_45%)] hover:underline underline-offset-4"
        >
          <ArrowLeft className="w-4 h-4" />
          До всіх новин
        </Link>

        <div className="mt-8 grid lg:grid-cols-[2fr_1fr] gap-10 lg:gap-12">
          <article>
            {imageUrl && (
              <div className="rounded-3xl overflow-hidden border border-[hsl(80_15%_88%)] shadow-card">
                <Image
                  src={imageUrl}
                  alt={post.main_photo?.alternativeText ?? post.title}
                  width={1200}
                  height={700}
                  className="w-full h-[260px] md:h-[420px] object-cover"
                  priority
                />
              </div>
            )}

            <div className="mt-8 max-w-3xl">
              {post.category && (
                <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(210_80%_92%)] px-4 py-2 text-xs font-semibold text-[hsl(86_50%_26%)] uppercase tracking-wide">
                  <Tag className="w-3.5 h-3.5" />
                  {post.category.name}
                </div>
              )}

              <h1 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-black text-[hsl(0_0%_21%)]">
                {post.title}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-sm text-[hsl(0_0%_40%)]">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </div>
            </div>

            <div className="mt-10 max-w-4xl">
              <RichTextContent body={post.body} />
            </div>

            {post.photos && post.photos.length > 0 && (
              <div className="mt-12">
                <NewsGallery photos={post.photos} title={post.title} />
              </div>
            )}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl border border-[hsl(80_15%_88%)] p-5 shadow-card">
              <h2 className="font-heading text-xl font-black text-[hsl(0_0%_21%)] mb-4">
                Останні новини
              </h2>
              <div className="space-y-4">
                {latestNews.map((news) => (
                  <Link
                    key={news.id}
                    href={`/news/${news.slug}`}
                    className="block group"
                  >
                    <p className="text-sm text-[hsl(0_0%_40%)]">
                      {formatDate(news.date)}
                    </p>
                    <p className="mt-1 font-semibold text-[hsl(0_0%_21%)] group-hover:text-[hsl(84_55%_45%)] transition-colors line-clamp-2">
                      {news.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[hsl(80_15%_88%)] p-5 shadow-card">
              <h2 className="font-heading text-xl font-black text-[hsl(0_0%_21%)] mb-4">
                Архів за місяцями
              </h2>
              <ArchiveSelect months={archiveMonths} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
