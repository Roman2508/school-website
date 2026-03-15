import { fetchStrapi } from "@/lib/strapi";
import type { NewsPost, StrapiListResponse } from "@/types/strapi";

export async function getLatestNews(limit = 3): Promise<NewsPost[]> {
  const res = await fetchStrapi<StrapiListResponse<NewsPost>>(
    `/news-posts?sort=date:desc&pagination[limit]=${limit}&populate=*&publicationState=live`
  );
  return res.data;
}
