"use client";

import Image from "next/image";
import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgRotate from "lightgallery/plugins/rotate";
import { Maximize2 } from "lucide-react";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-rotate.css";

import { getStrapiMedia } from "@/lib/strapi";
import type { StrapiMedia } from "@/types/strapi";

interface Props {
  photos: StrapiMedia[];
  title: string;
}

export default function NewsGallery({ photos, title }: Props) {
  const slides = photos.filter((photo) => !!photo?.url);
  if (slides.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-2xl md:text-3xl font-black text-[hsl(0_0%_21%)]">
          Фотогалерея
        </h2>
        <span className="text-sm text-[hsl(0_0%_40%)]">{slides.length} фото</span>
      </div>

      <LightGallery
        speed={400}
        plugins={[lgZoom, lgFullscreen, lgRotate]}
        download={false}
        counter={true}
        elementClassNames="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {slides.map((photo, index) => {
          const imageUrl = getStrapiMedia(photo.url);
          return (
            <a
              key={photo.id ?? index}
              href={imageUrl}
              className="group relative rounded-2xl overflow-hidden border border-[hsl(80_15%_88%)] shadow-card bg-[hsl(80_30%_93%)]"
            >
              <Image
                src={imageUrl}
                alt={photo.alternativeText ?? `${title} — фото ${index + 1}`}
                width={600}
                height={420}
                className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                <Maximize2 className="w-3 h-3" />
                Переглянути
              </span>
            </a>
          );
        })}
      </LightGallery>
    </section>
  );
}
