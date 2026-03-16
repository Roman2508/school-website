import { fetchStrapi } from "@/lib/strapi";
import type { StrapiListResponse, StuffMember } from "@/types/strapi";

export async function getAllStaff(): Promise<StuffMember[]> {
  const res = await fetchStrapi<StrapiListResponse<StuffMember>>(
    "/stuff-members?sort=weight:desc,name:asc&pagination[pageSize]=200&populate=*&publicationState=live"
  );
  return res.data ?? [];
}

export async function getStaffBySlug(slug: string): Promise<StuffMember | null> {
  const res = await fetchStrapi<StrapiListResponse<StuffMember>>(
    `/stuff-members?filters[slug][$eq]=${encodeURIComponent(
      slug
    )}&populate=*&publicationState=live`
  );
  return res.data[0] ?? null;
}
