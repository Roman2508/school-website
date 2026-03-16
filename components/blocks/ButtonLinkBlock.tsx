"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { SharedButtonLink } from "@/types/strapi";

interface Props {
  block: SharedButtonLink;
  index?: number;
}

export default function ButtonLinkBlock({ block, index = 0 }: Props) {
  const alignClass =
    block.align === "center"
      ? "text-center"
      : block.align === "right"
      ? "text-right"
      : "text-left";

  const widthClass = block.size === "full" ? "w-full" : "inline-flex";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={alignClass}
    >
      <Link
        href={block.link}
        className={`${widthClass} items-center justify-center
          rounded-xl bg-primary text-primary-foreground font-semibold
          px-6 py-3 text-sm shadow-hero
          hover:shadow-card-hover hover:-translate-y-0.5 hover:bg-[hsl(84_55%_38%)]
          transition-all duration-200`}
      >
        {block.text}
      </Link>
    </motion.div>
  );
}
