import { fetchStrapi } from "@/lib/strapi";
import type { HomepageData, StrapiSingleResponse } from "@/types/strapi";

const HOMEPAGE_POPULATE = [
  "Hero",
  "Hero.image",
  "Hero.buttons",
  "Hero.stats",
  "Hero.stats.image",
  "About",
  "About.image",
  "About.advantages",
  "Stats",
  "Stats.items",
  "Stats.items.image",
  "News",
  "Events",
  "Contacts",
  "Contacts.contact_persons",
  "Contacts.contact_persons.photo",
  "Contacts.info_items",
  "Contacts.info_items.icon",
]
  .map((path, index) => `populate[${index}]=${path}`)
  .join("&");

export async function getHomepage(): Promise<HomepageData> {
  const res = await fetchStrapi<StrapiSingleResponse<HomepageData>>(
    `/homepage?${HOMEPAGE_POPULATE}`
  );
  return res.data;
}
