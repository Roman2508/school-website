import { fetchStrapi } from "@/lib/strapi";
import type { FooterData, StrapiSingleResponse } from "@/types/strapi";

const FOOTER_POPULATE = [
  "logo",
  "contacts",
  "contacts.items",
  "contacts.items.icon",
  "nav_columns",
  "nav_columns.items",
]
  .map((path, index) => `populate[${index}]=${path}`)
  .join("&");

export async function getFooter(): Promise<FooterData> {
  const res = await fetchStrapi<StrapiSingleResponse<FooterData>>(
    `/footer?${FOOTER_POPULATE}`
  );
  return res.data;
}
