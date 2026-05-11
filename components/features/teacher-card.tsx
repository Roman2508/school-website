import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

import { getStrapiMedia } from "@/lib/strapi";
import type { StuffMember } from "@/types/strapi";

export default function TeacherCard({ member }: { member: StuffMember }) {
  const imageUrl = getStrapiMedia(member.photo?.url);

  return (
    <article className="bg-white rounded-2xl border border-[hsl(80_15%_88%)] overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 group">
      <Link href={`/teachers/${member.slug}`} className="block">
        <div className="relative overflow-hidden aspect-[3/2] bg-[hsl(80_30%_93%)]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={member.photo?.alternativeText ?? member.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[hsl(84_55%_45%)] text-4xl font-heading font-black">
              T
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/teachers/${member.slug}`} className="block">
          <h3 className="font-heading font-bold text-base mb-1 line-clamp-2 group-hover:text-[hsl(84_55%_45%)] transition-colors text-[hsl(0_0%_21%)]">
            {member.name}
          </h3>
        </Link>
        {member.role && (
          <p className="text-sm text-[hsl(0_0%_40%)] mb-3">{member.role}</p>
        )}

        <div className="space-y-2 text-xs text-[hsl(0_0%_40%)]">
          {member.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <a
                href={`mailto:${member.email}`}
                className="hover:text-[hsl(84_55%_45%)] transition-colors"
              >
                {member.email}
              </a>
            </div>
          )}
          {member.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              <a
                href={`tel:${member.phone}`}
                className="hover:text-[hsl(84_55%_45%)] transition-colors"
              >
                {member.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
