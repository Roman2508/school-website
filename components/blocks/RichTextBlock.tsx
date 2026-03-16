"use client";

import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import type { SharedRichText } from "@/types/strapi";

interface Props {
  block: SharedRichText;
  index?: number;
}

export default function RichTextBlock({ block, index = 0 }: Props) {
  if (!block.body) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="prose prose-green max-w-none text-foreground leading-relaxed
                 prose-headings:font-heading prose-headings:font-black prose-headings:text-foreground
                 prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                 prose-strong:text-foreground prose-li:marker:text-primary"
    >
      <ReactMarkdown>{block.body}</ReactMarkdown>
    </motion.div>
  );
}
