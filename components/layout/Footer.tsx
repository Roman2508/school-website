import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/strapi";
import type { FooterData, FooterInfoItem } from "@/types/strapi";

function ContactItem({ item }: { item: FooterInfoItem }) {
  const iconUrl = getStrapiMedia(item.icon?.url);
  return (
    <li className="flex items-center gap-3 text-sm text-white/70">
      {iconUrl ? (
        <Image
          src={iconUrl}
          alt={item.icon?.alternativeText ?? ""}
          width={20}
          height={20}
          className="w-5 h-5 mt-0.5 object-contain opacity-70 shrink-0"
        />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2 shrink-0" />
      )}
      <div>
        <div className="text-white/40 text-xs mb-0.5">{item.label}</div>
        <div className="leading-snug">{item.value}</div>
      </div>
    </li>
  );
}

export default function Footer({ data }: { data: FooterData }) {
  const logoUrl = getStrapiMedia(data.logo?.url);

  return (
    <footer className="bg-[hsl(0_0%_21%)] pt-16 pb-8">
      <div className="container">
        {/* Main grid */}
        <div
          className={`grid gap-10 mb-12 ${
            data.nav_columns && data.nav_columns.length > 0
              ? "grid-cols-1 lg:grid-cols-[320px_1fr_280px]"
              : "md:grid-cols-2"
          }`}
        >
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={data.logo?.alternativeText ?? "Логотип"}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[hsl(84_55%_45%)] flex items-center justify-center">
                  <span className="text-white font-heading font-black text-xl">
                    Ш
                  </span>
                </div>
              )}
            </div>
            <h4 className="font-heading font-bold text-lg text-white leading-tight mb-2">
              {data.title}
            </h4>
            {data.subtitle && (
              <p className="text-base text-white/60 leading-relaxed max-w-xs">
                {data.subtitle}
              </p>
            )}
          </div>

          {/* Nav columns */}
          {data.nav_columns && data.nav_columns.length > 0 && (
            <div
              className={`grid gap-8 ${
                data.nav_columns.length === 1
                  ? ""
                  : data.nav_columns.length === 2
                    ? "sm:grid-cols-2"
                    : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {data.nav_columns.map((col) => (
                <div key={col.id}>
                  <h4 className="font-heading font-bold text-white mb-4 text-sm uppercase tracking-wide">
                    {col.heading}
                  </h4>
                  <ul className="space-y-2">
                    {col.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.link}
                          className="text-sm text-white/60 hover:text-white transition-colors"
                        >
                          {item.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Contacts column */}
          {data.contacts && (
            <div>
              <h4 className="font-heading font-bold text-white mb-4 text-sm uppercase tracking-wide">
                {data.contacts.heading}
              </h4>
              <ul className="space-y-3">
                {data.contacts.items?.map((item) => (
                  <ContactItem key={item.id} item={item} />
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/40">{data.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
