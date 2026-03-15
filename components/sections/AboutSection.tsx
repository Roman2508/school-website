import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { getStrapiMedia } from "@/lib/strapi";
import type { AboutSectionData } from "@/types/strapi";

export default function AboutSection({ data }: { data: AboutSectionData }) {
  const imageUrl = getStrapiMedia(data.image?.url);

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(84_55%_45%/0.05)] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[hsl(0_0%_21%)] mb-6 font-heading leading-tight">
              <span className="text-gradient-primary">{data.title}</span>
            </h2>

            <div className="space-y-4 text-[hsl(0_0%_40%)] leading-relaxed text-base md:text-lg mb-8">
              {data.body.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {data.advantages && data.advantages.length > 0 && (
              <ul className="space-y-3">
                {data.advantages.map((adv) => (
                  <li key={adv.id} className="flex items-center gap-3 text-[hsl(0_0%_21%)]">
                    <CheckCircle className="w-5 h-5 text-[hsl(84_55%_45%)] shrink-0" />
                    <span className="font-medium">{adv.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Image */}
          {imageUrl && (
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-card-hover">
                <Image
                  src={imageUrl}
                  alt={data.image?.alternativeText ?? data.title}
                  width={600}
                  height={420}
                  className="w-full h-[420px] object-cover"
                  loading="lazy"
                />
                {(data.image_title || data.image_text) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-16">
                    {data.image_title && (
                      <p className="text-white font-heading font-bold text-xl">
                        {data.image_title}
                      </p>
                    )}
                    {data.image_text && (
                      <p className="text-white/80 text-sm mt-1">
                        {data.image_text}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
