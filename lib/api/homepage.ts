import { fetchStrapi } from "@/lib/strapi";
import type { HomepageData, StrapiSingleResponse } from "@/types/strapi";

export async function getHomepage(): Promise<HomepageData> {
  const res = await fetchStrapi<StrapiSingleResponse<HomepageData>>(
    "/homepage?populate[Hero][populate][0]=image&populate[Hero][populate][1]=buttons&populate[Hero][populate][2]=stats.image&populate[About][populate][0]=image&populate[About][populate][1]=advantages&populate[Stats][populate][0]=items.image&populate[News]=true&populate[Events]=true&populate[Contacts][populate][0]=contact_persons.photo&populate[Contacts][populate][1]=info_items.icon"
  );
  return res.data;
}
