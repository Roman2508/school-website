import { fetchStrapi } from "@/lib/strapi";
import type { HeaderData, StrapiSingleResponse } from "@/types/strapi";

export async function getHeader(): Promise<HeaderData> {
  const res = await fetchStrapi<StrapiSingleResponse<HeaderData>>(
    "/header?populate[logo]=true&populate[navigation][populate][submenu][populate][submenu]=true&populate[social][populate]=icon"
  );
  return res.data;
}
