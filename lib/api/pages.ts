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
  // dynamic zones — MUST be * for polymorphic structures (Strapi v5)
  "populate[left_col_blocks][populate]=*",
  "populate[right_col_blocks][populate]=*",
].join("&")

async function fetchPageBySlug(
  slug: string,
  filter: "$eq" | "$eqi"
): Promise<Page | null> {
  const publicationState =
    process.env.NODE_ENV === "development" ? "preview" : "live"
  const path = `/pages?filters[slug][${filter}]=${encodeURIComponent(
    slug
  )}&${PAGE_POPULATE}&publicationState=${publicationState}`
  try {
    const res = await fetchStrapi<StrapiListResponse<Page>>(path)
    return res.data[0] ?? null
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Strapi pages fetch failed:", path)
      console.error(err)
    }
    throw err
  }
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const candidates = [slug, `/${slug}`].filter(Boolean)

  for (const candidate of candidates) {
    const page = await fetchPageBySlug(candidate, "$eq")
    if (page) return page
  }

  for (const candidate of candidates) {
    const page = await fetchPageBySlug(candidate, "$eqi")
    if (page) return page
  }

  if (process.env.NODE_ENV === "development") {
    try {
      const slugs = await getAllPageSlugs()
      console.error("CMS page not found. Slugs in CMS:", slugs)
      console.error("CMS page lookup candidates:", candidates)
    } catch (err) {
      console.error("Failed to list CMS slugs", err)
    }
  }

  throw new Error(`Page not found: ${slug}`)
}

export async function getAllPageSlugs(): Promise<{ slug: string }[]> {
  const publicationState =
    process.env.NODE_ENV === "development" ? "preview" : "live"
  const res = await fetchStrapi<StrapiListResponse<{ slug: string }>>(
    `/pages?fields[0]=slug&pagination[limit]=200&publicationState=${publicationState}`,
  )
  return res.data
}
