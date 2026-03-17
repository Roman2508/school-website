/**
 * Clean domain types for the school website.
 * These wrap the auto-generated types from types/strapi-generated.ts
 * for ergonomic use in React components.
 *
 * Re-generate the base types whenever CMS schemas change:
 *   npx openapi-typescript "d:/projects/school-website/cms/src/extensions/documentation/documentation/1.0.0/full_documentation.json" -o types/strapi-generated.ts
 */
import type { components } from './strapi-generated'

// ─── Media ───────────────────────────────────────

export type StrapiMedia = components['schemas']['UploadFile'] & {
  url: string
  alternativeText?: string | null
  width?: number | null
  height?: number | null
  formats?: Record<string, { url: string; width: number; height: number }> | null
}

// ─── Header navigation (3 levels) ───────────────

/** Level 3 — leaf node */
export interface NavItemLevel3 {
  id: number
  text: string
  link: string
}

/** Level 2 — can have children (level 3) */
export interface NavItemLevel2 {
  id: number
  text: string
  link: string
  submenu?: NavItemLevel3[]
}

/** Level 1 — top-level nav entry, can have children (level 2) */
export interface NavItemLevel1 {
  id: number
  title: string
  link: string
  submenu?: NavItemLevel2[]
}

export interface SocialLink {
  id: number
  link: string
  icon: StrapiMedia
}

export interface HeaderData {
  id: number
  title?: string | null
  logo: StrapiMedia
  navigation: NavItemLevel1[]
  social?: SocialLink[]
}

// ─── Footer ──────────────────────────────────────

export interface FooterInfoItem {
  id: number
  label: string
  value: string
  icon?: StrapiMedia | null
}

export interface FooterColumnItem {
  id: number
  text: string
  link: string
}

export interface FooterColumn {
  id: number
  heading: string
  items: FooterColumnItem[]
}

export interface FooterContacts {
  id: number
  heading: string
  items: FooterInfoItem[]
}

export interface FooterData {
  id: number
  title: string
  subtitle?: string | null
  logo: StrapiMedia
  contacts: FooterContacts
  nav_columns?: FooterColumn[]
  copyright: string
}

// ─── Homepage sections ────────────────────────────

export interface HeroButton {
  id: number
  text: string
  link: string
  button_type: 'primary' | 'outline'
}

export interface HeroStat {
  id: number
  value: string
  text: string
  align: 'left' | 'center' | 'right'
  image: StrapiMedia
}

export interface HeroSectionData {
  id: number
  title: string
  subtitle?: string | null
  image: StrapiMedia
  buttons?: HeroButton[]
  stats?: HeroStat[]
  bottom_button_text?: string | null
}

export interface AboutAdvantage {
  id: number
  text: string
}

export interface AboutSectionData {
  id: number
  title: string
  body: string
  advantages?: AboutAdvantage[]
  image: StrapiMedia
  image_title?: string | null
  image_text?: string | null
}

export interface StatItem {
  id: number
  value: string
  text: string
  align: 'left' | 'center' | 'right'
  image: StrapiMedia
}

export interface StatsBlockData {
  id: number
  title?: string | null
  items: StatItem[]
}

export interface NewsFeedData {
  id: number
  title: string
  subtitle?: string | null
  all_link_label: string
  limit: number
}

export interface EventsFeedData {
  id: number
  title: string
  subtitle?: string | null
  all_link_label: string
  limit: number
}

export interface HomeInfoItem {
  id: number
  label: string
  value: string
  icon?: StrapiMedia | null
}

export interface StuffMember {
  id: number
  documentId: string
  name: string
  slug: string
  role?: string | null
  photo?: StrapiMedia | null
  phone?: string | null
  email?: string | null
  bio?: unknown
  weight?: number
}

export interface ContactsSectionData {
  id: number
  title: string
  subtitle?: string | null
  contact_persons?: StuffMember[]
  info_title: string
  info_items: HomeInfoItem[]
  map_embed_url: string
}

export interface HomepageData {
  id: number
  Hero: HeroSectionData
  About: AboutSectionData
  Stats: StatsBlockData
  News: NewsFeedData
  Events: EventsFeedData
  Contacts: ContactsSectionData
}

// ─── Collection types ─────────────────────────────

export interface Category {
  id: number
  documentId: string
  name: string
  slug: string
}

export interface NewsPost {
  id: number
  documentId: string
  title: string
  slug: string
  date: string
  category?: Category | null
  main_photo: StrapiMedia
  photos?: StrapiMedia[]
  body?: unknown
}

export interface EventPost {
  id: number
  documentId: string
  title: string
  slug: string
  date: string
  end_date?: string | null
  location?: string | null
  body?: unknown
}

// ─── Strapi REST response wrappers ───────────────

export interface StrapiSingleResponse<T> {
  data: T
  meta: Record<string, unknown>
}

export interface StrapiListResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// ─── Page dynamic zone block types ───────────────

export interface SharedRichText {
  __component: 'shared.rich-text'
  id: number
  body?: string | null
}

export interface SharedButtonLink {
  __component: 'shared.button-link'
  id: number
  text: string
  link: string
  size: 'full' | 'auto'
  align: 'left' | 'center' | 'right'
  variant: 'default' | 'outline' | 'link' | 'secondary'
}

export interface SharedMedia {
  __component: 'shared.media'
  id: number
  file: StrapiMedia
}

export interface SharedAccordionItem {
  id: number
  title: string
  body: unknown // Strapi Blocks JSON
  default_open: boolean
}

export interface SharedAccordion {
  __component: 'shared.accordion'
  id: number
  title: string
  multiply_open: boolean
  items?: SharedAccordionItem[]
}

export type DynamicBlock = SharedRichText | SharedButtonLink | SharedMedia | SharedAccordion

// ─── Page ────────────────────────────────────────

/** Lightweight parent reference used for breadcrumbs (3 levels deep) */
export interface PageParent {
  id: number
  documentId: string
  title: string
  slug: string
  parent_page?: PageParent | null
}

export interface Page {
  id: number
  documentId: string
  title: string
  slug: string
  subtitle?: string | null
  background_image?: StrapiMedia | null
  layout: 'col-12' | 'col-6-6' | 'col-8-4' | 'col-9-3'
  left_col_blocks: DynamicBlock[]
  right_col_blocks?: DynamicBlock[] | null
  reverse_cols_on_mobile: boolean
  parent_page?: PageParent | null
}
