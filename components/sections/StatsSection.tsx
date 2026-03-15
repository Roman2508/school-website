import Image from "next/image";
import { getStrapiMedia } from "@/lib/strapi";
import type { StatsBlockData } from "@/types/strapi";

export default function StatsSection({ data }: { data: StatsBlockData }) {
  return (
    <section className="py-20 bg-stats-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
      </div>

      <div className="container relative z-10">
        {data.title && (
          <h2 className="font-heading text-3xl md:text-4xl font-black text-center mb-14 text-white">
            {data.title}
          </h2>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {data.items.map((stat) => {
            const imgUrl = getStrapiMedia(stat.image?.url);
            return (
              <div
                key={stat.id}
                className={`text-center ${
                  stat.align === "left"
                    ? "text-left"
                    : stat.align === "right"
                    ? "text-right"
                    : "text-center"
                }`}
              >
                {imgUrl && (
                  <div className="flex justify-center mb-3">
                    <Image
                      src={imgUrl}
                      alt={stat.image?.alternativeText ?? stat.text}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                )}
                <div className="font-heading text-3xl md:text-4xl font-black text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-white/80">{stat.text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
