import { fetchStrapi } from "@/lib/strapi";
import type { EventPost, StrapiListResponse } from "@/types/strapi";

export async function getUpcomingEvents(limit = 4): Promise<EventPost[]> {
  const today = new Date().toISOString();
  const res = await fetchStrapi<StrapiListResponse<EventPost>>(
    `/event-posts?sort=date:asc&filters[date][$gte]=${today}&pagination[limit]=${limit}&publicationState=live`
  );
  // Fall back to most recent if no upcoming events
  if (res.data.length === 0) {
    const fallback = await fetchStrapi<StrapiListResponse<EventPost>>(
      `/event-posts?sort=date:desc&pagination[limit]=${limit}&publicationState=live`
    );
    return fallback.data;
  }
  return res.data;
}

export interface EventsQuery {
  page?: number;
  pageSize?: number;
  year?: number;
  month?: number;
}

export async function getEventsPage({
  page = 1,
  pageSize = 9,
  year,
  month,
}: EventsQuery): Promise<StrapiListResponse<EventPost>> {
  const params = new URLSearchParams();
  params.set("sort", "date:desc");
  params.set("pagination[page]", page.toString());
  params.set("pagination[pageSize]", pageSize.toString());
  params.set("publicationState", "live");

  if (year && month) {
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    params.set("filters[date][$gte]", start.toISOString());
    params.set("filters[date][$lte]", end.toISOString());
  }

  return fetchStrapi<StrapiListResponse<EventPost>>(
    `/event-posts?${params.toString()}`
  );
}

export async function getEventsArchiveMonths(): Promise<
  { year: number; month: number; value: string; label: string }[]
> {
  const pageSize = 100;
  const first = await fetchStrapi<StrapiListResponse<EventPost>>(
    `/event-posts?fields[0]=date&sort=date:desc&pagination[page]=1&pagination[pageSize]=${pageSize}&publicationState=live`
  );

  const pageCount = first.meta.pagination.pageCount;
  const pages =
    pageCount && pageCount > 1
      ? await Promise.all(
          Array.from({ length: pageCount - 1 }, (_, i) =>
            fetchStrapi<StrapiListResponse<EventPost>>(
              `/event-posts?fields[0]=date&sort=date:desc&pagination[page]=${
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
