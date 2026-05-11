import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import NewsCard from "@/components/features/news-card";
import NewsFilters from "@/components/pages/news/NewsFilters";
import {
  getNewsArchiveMonths,
  getNewsCategories,
  getNewsPage,
} from "@/lib/api/news";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Новини",
    description: "Останні новини та оголошення школи.",
  };
}

function parseMonth(value?: string) {
  if (!value) return { year: undefined, month: undefined };
  const match = /^\d{4}-\d{2}$/.test(value);
  if (!match) return { year: undefined, month: undefined };
  const [yearStr, monthStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!year || month < 1 || month > 12)
    return { year: undefined, month: undefined };
  return { year, month };
}

function buildPageLink(
  page: number,
  filters: { category?: string; month?: string },
) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.month) params.set("month", filters.month);
  params.set("page", page.toString());
  return `/news?${params.toString()}`;
}

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams;
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
  const categoryParam = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const monthParam = Array.isArray(params.month)
    ? params.month[0]
    : params.month;

  const page = Math.max(1, Number(pageParam ?? 1) || 1);
  const selectedCategory =
    typeof categoryParam === "string" ? categoryParam : undefined;
  const selectedMonth = typeof monthParam === "string" ? monthParam : undefined;

  const { year, month } = parseMonth(selectedMonth);

  const [newsResponse, categories, months] = await Promise.all([
    getNewsPage({ page, pageSize: 9, category: selectedCategory, year, month }),
    getNewsCategories(),
    getNewsArchiveMonths(),
  ]);

  const posts = newsResponse.data ?? [];
  const pagination = newsResponse.meta.pagination;
  const totalPages = Math.max(1, pagination.pageCount ?? 1);
  const totalItems = pagination.total ?? posts.length;

  const pageStart = Math.max(1, page - 2);
  const pageEnd = Math.min(totalPages, pageStart + 4);
  const adjustedStart = Math.max(1, pageEnd - 4);
  const pageNumbers = Array.from(
    { length: pageEnd - adjustedStart + 1 },
    (_, i) => adjustedStart + i,
  );

  return (
    <>
      <section className="relative py-10 md:py-12 overflow-visible overflow-x-clip bg-white">
        <div className="absolute -top-24 -right-24 w-[260px] h-[260px] bg-[hsl(84_55%_45%/0.08)] rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-[240px] h-[240px] bg-[hsl(50_100%_50%/0.12)] rounded-full blur-3xl" />
        <div className="container relative z-10 space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(84_55%_45%)] hover:underline underline-offset-4"
          >
            <ArrowLeft className="w-4 h-4" />
            На головну
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-3xl md:text-4xl font-black text-[hsl(0_0%_21%)]">
                Всі новини
              </h1>
              <span className="inline-flex items-center rounded-full bg-[hsl(80_30%_93%)] px-3 py-1 text-xs font-semibold text-[hsl(0_0%_40%)]">
                Новин: {totalItems}
              </span>
            </div>
          </div>

          <NewsFilters
            months={months}
            categories={categories.map((category) => ({
              slug: category.slug,
              name: category.name,
            }))}
            selectedMonth={selectedMonth}
            selectedCategory={selectedCategory}
          />
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container space-y-10">
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[hsl(80_15%_88%)] p-10 text-center shadow-card">
              <p className="text-lg font-semibold text-[hsl(0_0%_21%)]">
                Новин за вибраними фільтрами не знайдено
              </p>
              <p className="mt-2 text-[hsl(0_0%_40%)]">
                Спробуйте змінити місяць або категорію.
              </p>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-[hsl(84_55%_45%)] font-semibold hover:underline underline-offset-4 mt-4 cursor-pointer"
              >
                Скинути фільтри <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-[hsl(0_0%_40%)]">
                Сторінка {page} з {totalPages}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={buildPageLink(Math.max(1, page - 1), {
                    category: selectedCategory,
                    month: selectedMonth,
                  })}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                    page === 1
                      ? "pointer-events-none text-[hsl(0_0%_60%)] bg-[hsl(80_30%_93%)]"
                      : "bg-white hover:bg-[hsl(80_30%_93%)] text-[hsl(0_0%_21%)]"
                  }`}
                >
                  Назад
                </Link>
                {pageNumbers.map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={buildPageLink(pageNum, {
                      category: selectedCategory,
                      month: selectedMonth,
                    })}
                    className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                      pageNum === page
                        ? "bg-[hsl(84_55%_45%)] text-white border-[hsl(84_55%_45%)]"
                        : "bg-white hover:bg-[hsl(80_30%_93%)] text-[hsl(0_0%_21%)]"
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
                <Link
                  href={buildPageLink(Math.min(totalPages, page + 1), {
                    category: selectedCategory,
                    month: selectedMonth,
                  })}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                    page === totalPages
                      ? "pointer-events-none text-[hsl(0_0%_60%)] bg-[hsl(80_30%_93%)]"
                      : "bg-white hover:bg-[hsl(80_30%_93%)] text-[hsl(0_0%_21%)]"
                  }`}
                >
                  Далі
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
