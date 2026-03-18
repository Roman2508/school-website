import Image from 'next/image'
import { MapPin, Phone, Mail } from 'lucide-react'
import { getStrapiMedia } from '@/lib/strapi'
import type { ContactsSectionData, StuffMember, HomeInfoItem } from '@/types/strapi'
import { formatRichText } from '@/lib/utils'

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

const GRADIENT_CLASSES = [
  'from-[hsl(84_55%_45%)] to-[hsl(84_55%_60%)]',
  'from-[hsl(150_55%_38%)] to-[hsl(150_55%_50%)]',
  'from-[hsl(50_100%_42%)] to-[hsl(50_100%_55%)]',
  'from-[hsl(0_65%_48%)] to-[hsl(0_65%_60%)]',
]

function PersonCard({ member, idx }: { member: StuffMember; idx: number }) {
  const photoUrl = getStrapiMedia(member.photo?.url)
  const gradient = GRADIENT_CLASSES[idx % GRADIENT_CLASSES.length]

  return (
    <div className="rounded-2xl border border-[hsl(80_15%_88%)] bg-white overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group">
      {/* Gradient header */}
      <div className={`h-20 bg-gradient-to-r ${gradient} relative`}>
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2">
          <div className="w-14 h-14 rounded-full border-4 border-white shadow-md overflow-hidden bg-[hsl(84_55%_45%)] flex items-center justify-center">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={member.photo?.alternativeText ?? member.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-sm">{getInitials(member.name)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="pt-10 pb-5 px-5 text-center">
        <h4 className="font-bold text-[hsl(0_0%_21%)] text-sm leading-tight mb-0.5">{member.name}</h4>
        {member.role && <p className="text-xs text-[hsl(84_55%_45%)] font-semibold mb-4">{member.role}</p>}
        <div className="space-y-2">
          {member.phone && (
            <a
              href={`tel:${member.phone.replace(/[^\d+]/g, '')}`}
              className="flex items-center justify-center gap-2 text-[hsl(0_0%_40%)] hover:text-[hsl(84_55%_45%)] text-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {member.phone}
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="flex items-center justify-center gap-2 text-[hsl(0_0%_40%)] hover:text-[hsl(84_55%_45%)] text-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              {member.email}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoItem({ item }: { item: HomeInfoItem }) {
  const iconUrl = getStrapiMedia(item.icon?.url)
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-[hsl(84_55%_45%/0.1)] flex items-center justify-center shrink-0">
        {iconUrl ? (
          <Image
            src={iconUrl}
            alt={item.icon?.alternativeText ?? item.label}
            width={20}
            height={20}
            className="w-5 h-5 object-contain"
          />
        ) : (
          <MapPin className="w-5 h-5 text-[hsl(84_55%_45%)]" />
        )}
      </div>
      <div>
        <p className="font-semibold text-[hsl(0_0%_21%)] text-sm">{item.label}</p>
        <p className="text-[hsl(0_0%_40%)] text-sm mt-0.5 whitespace-pre-line">{item.value}</p>
      </div>
    </div>
  )
}

export default function ContactsSection({ data }: { data: ContactsSectionData }) {
  return (
    <section id="contacts" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(80_30%_93%/0.4)] via-white to-white pointer-events-none" />
      <div className="absolute top-20 -right-32 w-96 h-96 bg-[hsl(84_55%_45%/0.05)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -left-32 w-80 h-80 bg-[hsl(50_100%_50%/0.08)] rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-[hsl(0_0%_21%)]">
            {formatRichText(data.title)}
          </h2>
          {data.subtitle && <p className="text-[hsl(0_0%_40%)] text-lg max-w-xl mx-auto">{data.subtitle}</p>}
        </div>

        {/* Staff cards */}
        {data.contact_persons && data.contact_persons.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {data.contact_persons.map((member, i) => (
              <PersonCard key={member.id} member={member} idx={i} />
            ))}
          </div>
        )}

        {/* Address + Map */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Address info */}
          <div className="lg:col-span-2 rounded-2xl border border-[hsl(80_15%_88%)] bg-white p-6 md:p-8 shadow-card flex flex-col justify-center">
            <h3 className="font-heading font-bold text-xl text-[hsl(0_0%_21%)] mb-6">{data.info_title}</h3>
            <div className="space-y-5">
              {data.info_items.map((item) => (
                <InfoItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-[hsl(80_15%_88%)] shadow-card min-h-[350px]">
            <iframe
              src={data.map_embed_url}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 350, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Розташування школи на карті"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
