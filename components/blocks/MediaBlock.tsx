"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getStrapiMedia } from "@/lib/strapi";
import type { SharedMedia } from "@/types/strapi";

interface Props {
  block: SharedMedia;
  index?: number;
}

export default function MediaBlock({ block, index = 0 }: Props) {
  const file = block.file;
  if (!file) return null;

  const url = getStrapiMedia(file.url);
  const mime = (file as any).mime as string | undefined;
  const isVideo = mime?.startsWith("video/");
  const isImage = mime?.startsWith("image/") || (!isVideo && url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="w-full"
    >
      {isVideo ? (
        <video
          src={url}
          controls
          className="w-full rounded-2xl shadow-card"
        />
      ) : isImage ? (
        <div className="relative w-full rounded-2xl overflow-hidden shadow-card">
          <Image
            src={url}
            alt={file.alternativeText ?? ""}
            width={file.width ?? 800}
            height={file.height ?? 500}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          📎 {file.alternativeText ?? url.split("/").pop()}
        </a>
      )}
    </motion.div>
  );
}
