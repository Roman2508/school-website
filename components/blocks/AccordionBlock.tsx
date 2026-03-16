"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import type { SharedAccordion } from "@/types/strapi";

interface Props {
  block: SharedAccordion;
  index?: number;
}

export default function AccordionBlock({ block, index = 0 }: Props) {
  // Track open items; init from default_open flags
  const [openSet, setOpenSet] = useState<Set<number>>(() => {
    const s = new Set<number>();
    block.items?.forEach((item, i) => {
      if (item.default_open) s.add(i);
    });
    return s;
  });

  const toggle = (i: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        if (!block.multiply_open) next.clear();
        next.add(i);
      }
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="space-y-1"
    >
      {block.title && (
        <h3 className="font-heading font-black text-xl md:text-2xl text-foreground mb-4">
          {block.title}
        </h3>
      )}

      <div className="space-y-3">
        {block.items?.map((item, i) => {
          const isOpen = openSet.has(i);
          return (
            <div
              key={item.id ?? i}
              className={`bg-card rounded-2xl border border-border overflow-hidden transition-shadow duration-200 ${
                isOpen ? "shadow-card-hover" : "shadow-card"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left
                           font-heading font-bold text-sm md:text-base cursor-pointer"
                aria-expanded={isOpen}
              >
                <span>{item.title}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-primary text-xl leading-none shrink-0"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed
                                    prose prose-sm prose-green max-w-none
                                    prose-a:text-primary prose-strong:text-foreground">
                      <BlocksRenderer content={item.body as any} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
