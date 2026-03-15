import { fetchStrapi } from "@/lib/strapi";
import type { FooterData, StrapiSingleResponse } from "@/types/strapi";

export async function getFooter(): Promise<FooterData> {
  const res = await fetchStrapi<StrapiSingleResponse<FooterData>>(
    "/footer?populate[logo]=true&populate[contacts][populate]=items.icon&populate[nav_columns][populate]=items"
  );
  return res.data;
}
