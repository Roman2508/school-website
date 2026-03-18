// @ts-nocheck

import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Mail, Phone } from 'lucide-react'

import { getStrapiMedia } from '@/lib/strapi'
import { getStaffBySlug } from '@/lib/api/staff'
import RichTextContent from '@/components/blocks/RichTextContent'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const member = await getStaffBySlug(slug)
  if (!member) {
    return { title: 'Вчитель' }
  }
  return {
    title: member.name,
    description: typeof member.bio === 'string' ? member.bio.slice(0, 160) : undefined,
  }
}

export default async function TeacherPage({ params }: Props) {
  const { slug } = await params
  const member = await getStaffBySlug(slug)

  if (!member) {
    notFound()
  }

  const imageUrl = getStrapiMedia(member.photo?.url)

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <Link
          href="/teachers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(84_55%_45%)] hover:underline underline-offset-4"
        >
          <ArrowLeft className="w-4 h-4" />
          До всіх працівників
        </Link>

        <div className="mt-8 grid items-start lg:grid-cols-[340px_3fr] gap-10 lg:gap-12">
          <div className="bg-white rounded-3xl border border-[hsl(80_15%_88%)] shadow-card overflow-hidden min-[500px]:w-90  lg:w-full block lg:sticky lg:top-36">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={member.photo?.alternativeText ?? member.name}
                width={600}
                height={700}
                className="w-full h-[440px] object-cover"
                priority
              />
            ) : (
              <div className="w-full h-[440px] bg-[hsl(80_30%_93%)] flex items-center justify-center text-[hsl(84_55%_45%)] text-5xl font-heading font-black">
                T
              </div>
            )}
          </div>

          <div>
            <h1 className="font-heading text-xl min-[500px]:text-2xl sm:text-3xl md:text-4xl font-black text-[hsl(0_0%_21%)]">
              {member.name}
            </h1>
            {member.role && <p className="mt-2 text-lg text-[hsl(0_0%_40%)]">{member.role}</p>}

            <div className="mt-6 space-y-2 text-sm text-[hsl(0_0%_40%)]">
              {member.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${member.email}`} className="hover:text-[hsl(84_55%_45%)] transition-colors">
                    {member.email}
                  </a>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${member.phone}`} className="hover:text-[hsl(84_55%_45%)] transition-colors">
                    {member.phone}
                  </a>
                </div>
              )}
            </div>

            {member.bio && (
              <div className="mt-8">
                <RichTextContent body={member.bio} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
