import { fetchStrapi } from "@/lib/strapi"
import type { Page, StrapiListResponse } from "@/types/strapi"

/**
 * Strapi v5 populate rules:
 *  - Regular relations/media: can use field targeting
 *  - Polymorphic dynamic zones: MUST use populate=* (Strapi v5 restriction)
 *
 * IMPORTANT: do NOT use URLSearchParams — it percent-encodes brackets which
 * causes Strapi to see %5B instead of [ and silently ignore the populate.
 * Use a plain string join instead.
 */
const PAGE_POPULATE = [
  // background image
  "populate[background_image][fields][0]=url",
  "populate[background_image][fields][1]=alternativeText",
  "populate[background_image][fields][2]=width",
  "populate[background_image][fields][3]=height",
  // parent page chain (3 levels for breadcrumbs)
  "populate[parent_page][fields][0]=title",
  "populate[parent_page][fields][1]=slug",
  "populate[parent_page][populate][parent_page][fields][0]=title",
  "populate[parent_page][populate][parent_page][fields][1]=slug",
  "populate[parent_page][populate][parent_page][populate][parent_page][fields][0]=title",
  "populate[parent_page][populate][parent_page][populate][parent_page][fields][1]=slug",
  // dynamic zones — MUST be * for polymorphic structures (Strapi v5)
  "populate[left_col_blocks][populate]=*",
  "populate[right_col_blocks][populate]=*",
].join("&")

export async function getPageBySlug(slug: string): Promise<Page> {
  const res = await fetchStrapi<StrapiListResponse<Page>>(
    `/pages?filters[slug][$eq]=${encodeURIComponent(slug)}&${PAGE_POPULATE}&publicationState=live`,
  )
  const page = res.data[0]
  if (!page) throw new Error(`Page not found: ${slug}`)
  return page
}

export async function getAllPageSlugs(): Promise<{ slug: string }[]> {
  const res = await fetchStrapi<StrapiListResponse<{ slug: string }>>(
    "/pages?fields[0]=slug&pagination[limit]=200&publicationState=live",
  )
  return res.data
}
