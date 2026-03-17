import Image from 'next/image'

import HeroTitle from './HeroTitle'
import Breadcrumbs from './Breadcrumbs'
import type { Page } from '@/types/strapi'
import { getStrapiMedia } from '@/lib/strapi'

type Props = Pick<Page, 'title' | 'subtitle' | 'background_image' | 'parent_page'>

export default function PageHero({ title, subtitle, background_image, parent_page }: Props) {
  const imageUrl = getStrapiMedia(background_image?.url)

  return (
    <section className="relative py-10 overflow-hidden h-100 relative">
      {/* Background */}
      {imageUrl ? (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={background_image?.alternativeText ?? title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-foreground/55" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-stats-gradient" />
      )}

      <div className="container relative z-10">
        <div className="mb-6">
          <Breadcrumbs currentTitle={title} parent={parent_page} />
        </div>
      </div>

      <HeroTitle title={title} subtitle={subtitle} />
    </section>
  )
}
