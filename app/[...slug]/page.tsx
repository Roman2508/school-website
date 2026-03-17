import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import PageHero from '@/components/pages/PageHero'
import PageLayout from '@/components/pages/PageLayout'
import { getPageBySlug, getAllPageSlugs } from '@/lib/api/pages'

interface Props {
  params: Promise<{ slug: string[] }>
}

// Static params for ISR
export async function generateStaticParams() {
  try {
    const pages = await getAllPageSlugs()
    return pages.map((p) => ({ slug: [p.slug] }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const slugStr = slug.join('/').replace(/^\/+|\/+$/g, '')
  try {
    const page = await getPageBySlug(slugStr)
    return {
      title: page.title,
      description: page.subtitle ?? undefined,
    }
  } catch {
    return { title: 'Сторінка' }
  }
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params
  const slugStr = slug.join('/').replace(/^\/+|\/+$/g, '')

  // getPageBySlug throws on 404 → notFound() redirects to Next.js 404 page
  const page = await getPageBySlug(slugStr).catch(() => notFound())

  return (
    <>
      <PageHero
        title={page.title}
        subtitle={page.subtitle}
        background_image={page.background_image}
        parent_page={page.parent_page}
      />

      <PageLayout
        layout={page.layout}
        leftBlocks={page.left_col_blocks ?? []}
        rightBlocks={page.right_col_blocks}
        reverseOnMobile={page.reverse_cols_on_mobile}
      />
    </>
  )
}
