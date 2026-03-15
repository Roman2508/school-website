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
