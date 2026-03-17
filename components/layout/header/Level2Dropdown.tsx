"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { NavItemLevel2 } from "@/types/strapi";

export default function Level2Dropdown({ items }: { items: NavItemLevel2[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeSide, setActiveSide] = useState<"right" | "left">("right");
  const canUseDOM = typeof window !== "undefined";

  const handleEnter = (index: number, el: HTMLDivElement | null) => {
    setActiveIndex(index);
    if (!canUseDOM || !el) return;
    const rect = el.getBoundingClientRect();
    const submenuWidth = 240;
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;
    if (spaceRight < submenuWidth && spaceLeft > spaceRight) {
      setActiveSide("left");
    } else {
      setActiveSide("right");
    }
  };

  return (
    <div className="min-w-[300px] bg-white rounded-2xl shadow-card-hover border border-[hsl(80_15%_88%)] py-2 z-50 overflow-visible">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="relative group/l2"
          onMouseEnter={(e) =>
            handleEnter(i, e.currentTarget as HTMLDivElement)
          }
          onMouseLeave={() => setActiveIndex(null)}
        >
          {item.link ? (
            <Link
              href={item.link}
              className="flex items-center justify-between px-4 py-2.5 text-sm text-dark hover:text-[hsl(84_55%_45%)] hover:bg-[hsl(80_30%_93%)] transition-colors"
            >
              <span>{item.text}</span>
              {item.submenu && item.submenu.length > 0 && (
                <ChevronRight className="w-3.5 h-3.5 ml-2 opacity-50" />
              )}
            </Link>
          ) : (
            <span className="flex items-center justify-between px-4 py-2.5 text-sm text-dark cursor-default">
              <span>{item.text}</span>
              {item.submenu && item.submenu.length > 0 && (
                <ChevronRight className="w-3.5 h-3.5 ml-2 opacity-50" />
              )}
            </span>
          )}
          {item.submenu && item.submenu.length > 0 && activeIndex === i && (
            <div
              className={`absolute top-0 min-w-[220px] bg-white rounded-2xl shadow-card-hover border border-[hsl(80_15%_88%)] py-2 z-50 overflow-hidden ${
                activeSide === "right" ? "left-full" : "right-full"
              }`}
            >
              {item.submenu.map((leaf) =>
                leaf.link ? (
                  <Link
                    key={leaf.id}
                    href={leaf.link}
                    className="block px-4 py-2.5 text-sm text-dark hover:text-[hsl(84_55%_45%)] hover:bg-[hsl(80_30%_93%)] transition-colors"
                  >
                    {leaf.text}
                  </Link>
                ) : (
                  <span
                    key={leaf.id}
                    className="block px-4 py-2.5 text-sm text-dark cursor-default"
                  >
                    {leaf.text}
                  </span>
                ),
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
