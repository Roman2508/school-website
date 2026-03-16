import { fetchStrapi } from "@/lib/strapi";
import type { Category, NewsPost, StrapiListResponse } from "@/types/strapi";

export async function getLatestNews(limit = 3): Promise<NewsPost[]> {
  const res = await fetchStrapi<StrapiListResponse<NewsPost>>(
    `/news-posts?sort=date:desc&pagination[limit]=${limit}&populate=*&publicationState=live`
  );
  return res.data;
}

export interface NewsQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  year?: number;
  month?: number;
}

export async function getNewsPage({
  page = 1,
  pageSize = 9,
  category,
  year,
  month,
}: NewsQuery): Promise<StrapiListResponse<NewsPost>> {
  const params = new URLSearchParams();
  params.set("sort", "date:desc");
  params.set("pagination[page]", page.toString());
  params.set("pagination[pageSize]", pageSize.toString());
  params.set("populate", "*");
  params.set("publicationState", "live");

  if (category) {
    params.set("filters[category][slug][$eq]", category);
  }

  if (year && month) {
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    params.set("filters[date][$gte]", start.toISOString());
    params.set("filters[date][$lte]", end.toISOString());
  }

  return fetchStrapi<StrapiListResponse<NewsPost>>(
    `/news-posts?${params.toString()}`
  );
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  const params = new URLSearchParams();
  params.set("filters[slug][$eq]", slug);
  params.set("populate", "*");
  params.set("publicationState", "live");

  const res = await fetchStrapi<StrapiListResponse<NewsPost>>(
    `/news-posts?${params.toString()}`
  );

  return res.data[0] ?? null;
}

export async function getNewsCategories(): Promise<Category[]> {
  const res = await fetchStrapi<StrapiListResponse<Category>>(
    `/categories?sort=name:asc&pagination[pageSize]=100&publicationState=live`
  );
  return res.data ?? [];
}

export async function getNewsArchiveMonths(): Promise<
  { year: number; month: number; value: string; label: string }[]
> {
  const pageSize = 100;
  const first = await fetchStrapi<StrapiListResponse<NewsPost>>(
    `/news-posts?fields[0]=date&sort=date:desc&pagination[page]=1&pagination[pageSize]=${pageSize}&publicationState=live`
  );

  const pageCount = first.meta.pagination.pageCount;
  const pages =
    pageCount && pageCount > 1
      ? await Promise.all(
          Array.from({ length: pageCount - 1 }, (_, i) =>
            fetchStrapi<StrapiListResponse<NewsPost>>(
              `/news-posts?fields[0]=date&sort=date:desc&pagination[page]=${
                i + 2
              }&pagination[pageSize]=${pageSize}&publicationState=live`
            )
          )
        )
      : [];

  const all = [
    ...(first.data ?? []),
    ...pages.flatMap((page) => page.data ?? []),
  ];

  const seen = new Set<string>();
  const months: { year: number; month: number; value: string; label: string }[] =
    [];

  all.forEach((post) => {
    const date = new Date(post.date);
    if (Number.isNaN(date.getTime())) return;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const value = `${year}-${String(month).padStart(2, "0")}`;
    if (seen.has(value)) return;
    seen.add(value);
    const label = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(
      "uk-UA",
      { month: "long", year: "numeric" }
    );
    months.push({ year, month, value, label });
  });

  months.sort((a, b) => (b.year - a.year) || (b.month - a.month));
  return months;
}
