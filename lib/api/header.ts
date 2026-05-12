import { fetchStrapi } from "@/lib/strapi";
import type { HeaderData, StrapiSingleResponse } from "@/types/strapi";

const HEADER_POPULATE = [
  "logo",
  "navigation",
  "navigation.submenu",
  "navigation.submenu.submenu",
  "social",
  "social.icon",
]
  .map((path, index) => `populate[${index}]=${path}`)
  .join("&");

export async function getHeader(): Promise<HeaderData> {
  const res = await fetchStrapi<StrapiSingleResponse<HeaderData>>(
    `/header?${HEADER_POPULATE}`
  );
  return res.data;
}
