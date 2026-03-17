"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { NavItemLevel1 } from "@/types/strapi";

export default function MobileNavItem({
  item,
  onClose,
}: {
  item: NavItemLevel1;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [openL2, setOpenL2] = useState<number | null>(null);
  const hasChildren = item.submenu && item.submenu.length > 0;
  const hasLink = Boolean(item.link);
  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };
  const handleTextClick = () => {
    if (hasChildren && !hasLink) {
      toggleOpen();
    }
  };

  return (
    <div className="border-b border-[hsl(80_15%_88%)] last:border-0">
      <div className="flex items-center justify-between">
        {hasLink ? (
          <Link
            href={item.link as string}
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-semibold text-dark hover:text-[hsl(84_55%_45%)] transition-colors"
          >
            {item.title}
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleTextClick}
            className={`flex-1 px-4 py-3 text-left text-sm font-semibold text-dark transition-colors ${
              hasChildren ? "cursor-pointer hover:text-[hsl(84_55%_45%)]" : "cursor-default"
            }`}
          >
            {item.title}
          </button>
        )}
        {hasChildren && (
          <button
            onClick={toggleOpen}
            className="p-3 text-[hsl(0_0%_40%)] hover:text-[hsl(84_55%_45%)] transition-colors"
            aria-label={open ? "Згорнути" : "Розгорнути"}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {hasChildren && open && item.submenu && (
        <div className="bg-[hsl(80_20%_97%)] px-4 pb-2">
          {item.submenu.map((l2, idx) => (
            <div key={l2.id}>
              <div className="flex items-center justify-between">
                {l2.link ? (
                  <Link
                    href={l2.link}
                    onClick={onClose}
                    className="flex-1 py-2 pl-3 text-sm text-dark hover:text-[hsl(84_55%_45%)] transition-colors"
                  >
                    {l2.text}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      l2.submenu && l2.submenu.length > 0
                        ? setOpenL2(openL2 === idx ? null : idx)
                        : null
                    }
                    className={`flex-1 py-2 pl-3 text-left text-sm text-dark transition-colors ${
                      l2.submenu && l2.submenu.length > 0
                        ? "cursor-pointer hover:text-[hsl(84_55%_45%)]"
                        : "cursor-default"
                    }`}
                  >
                    {l2.text}
                  </button>
                )}
                {l2.submenu && l2.submenu.length > 0 && (
                  <button
                    onClick={() => setOpenL2(openL2 === idx ? null : idx)}
                    className="p-2 text-[hsl(0_0%_40%)] hover:text-[hsl(84_55%_45%)] transition-colors"
                    aria-label={openL2 === idx ? "Згорнути" : "Розгорнути"}
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${openL2 === idx ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
              </div>
              {l2.submenu && l2.submenu.length > 0 && openL2 === idx && (
                <div className="pl-6 pb-1">
                  {l2.submenu.map((leaf) =>
                    leaf.link ? (
                      <Link
                        key={leaf.id}
                        href={leaf.link}
                        onClick={onClose}
                        className="block py-1.5 text-sm text-[hsl(0_0%_40%)] hover:text-[hsl(84_55%_45%)] transition-colors"
                      >
                        {leaf.text}
                      </Link>
                    ) : (
                      <span
                        key={leaf.id}
                        className="block py-1.5 text-sm text-[hsl(0_0%_40%)] cursor-default"
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
      )}
    </div>
  );
}
