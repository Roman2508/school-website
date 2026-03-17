import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia } from "@/lib/strapi";
import type { HeroSectionData } from "@/types/strapi";
import { formatRichText } from "@/lib/utils";

export default function HeroSection({ data }: { data: HeroSectionData }) {
  const imageUrl = getStrapiMedia(data.image?.url);

  return (
    <section className="relative overflow-hidden bg-hero-gradient h-[calc(100dvh-116px)] flex flex-col justify-center">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[hsl(340_70%_92%)] opacity-60 blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/3 w-64 h-64 rounded-full bg-[hsl(210_80%_92%)] opacity-50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[hsl(84_40%_90%)] opacity-50 blur-3xl pointer-events-none" />

      <div className="container relative z-10 py-4">
        {/* <div className="container relative z-10 py-16 md:py-24"> */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] mb-6 text-[hsl(0_0%_21%)]">
              {formatRichText(data.title)}
            </h1>

            {data.subtitle && (
              <p className="text-lg md:text-xl text-[hsl(0_0%_40%)] leading-relaxed mb-8 max-w-2xl">
                {data.subtitle}
              </p>
            )}

            {/* Buttons */}
            {data.buttons && data.buttons.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-10">
                {data.buttons.map((btn) => (
                  <Link
                    key={btn.id}
                    href={btn.link}
                    className={`inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
                      btn.button_type === "primary"
                        ? "bg-[hsl(84_55%_45%)] text-white hover:bg-[hsl(84_55%_38%)] shadow-[0_4px_14px_hsl(84_55%_45%/0.3)] hover:shadow-[0_6px_20px_hsl(84_55%_45%/0.4)] hover:-translate-y-0.5"
                        : "border-2 border-[hsl(84_55%_45%)] text-[hsl(84_55%_45%)] hover:bg-[hsl(80_30%_93%)] hover:-translate-y-0.5"
                    }`}
                  >
                    {btn.text}
                  </Link>
                ))}
              </div>
            )}

            {/* Mini stats */}
            {data.stats && data.stats.length > 0 && (
              <div className="flex flex-wrap gap-8">
                {data.stats.map((stat) => (
                  <div key={stat.id} className={`text-${stat.align}`}>
                    <div className="font-heading text-2xl font-black text-[hsl(84_55%_45%)]">
                      {stat.value}
                    </div>
                    <div className="text-sm text-[hsl(0_0%_40%)]">
                      {stat.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          {imageUrl && (
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[hsl(84_55%_45%/0.1)] rounded-3xl blur-2xl scale-95" />
                <Image
                  src={imageUrl}
                  alt={data.image?.alternativeText ?? data.title}
                  width={560}
                  height={480}
                  className="relative z-10 w-full max-w-md lg:max-w-lg animate-float object-contain"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      {data.bottom_button_text && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[hsl(45_99%_47%)] rounded-full py-3 px-6 text-center">
          <p className="text-sm font-heading font-semibold text-[hsl(0_0%_21%)]">
            {data.bottom_button_text} ⬇
          </p>
        </div>
      )}
    </section>
  );
}
