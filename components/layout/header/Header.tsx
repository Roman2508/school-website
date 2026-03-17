"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight, ChevronLeft } from "lucide-react";
import { getStrapiMedia } from "@/lib/strapi";
import type { HeaderData, SocialLink } from "@/types/strapi";
import NavItem from "./NavItem";
import MobileNavItem from "./MobileNavItem";
import { useNavScroll } from "./useNavScroll";

export default function Header({ data }: { data: HeaderData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMenuMaxHeight, setMobileMenuMaxHeight] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const { navScrollRef, showScrollLeft, showScrollRight, scrollNavBy } =
    useNavScroll();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setMobileOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const el = topRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setMobileMenuMaxHeight(Math.max(0, Math.floor(rect.height)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const logoUrl = getStrapiMedia(data.logo?.url);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[hsl(80_15%_88%)]"
    >
      <div ref={topRef}>
        {data.announcement_bar_text && (
          <div className="bg-stats-gradient text-center py-2 px-4">
            <p className="text-sm font-medium text-white">
              {data.announcement_bar_text}
            </p>
          </div>
        )}

        <div className="container flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-3 shrink-0">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={data.logo?.alternativeText ?? "Логотип"}
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
              priority
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[hsl(84_55%_45%)] flex items-center justify-center">
              <span className="text-white font-heading font-black text-xl">
                Ш
              </span>
            </div>
          )}
          {(data.title || data.subtitle) && (
            <div className="flex flex-col gap-1">
              {data.title && (
                <span className="font-heading font-black text-base leading-none block">
                  {data.title}
                </span>
              )}

              {data.subtitle && (
                <span className="text-sm text-muted-foreground inline-block leading-[1.2]">
                  {data.subtitle}
                </span>
              )}
            </div>
          )}
        </Link>

        <div className="hidden lg:flex items-center flex-1 px-4 min-w-0">
          <nav className="relative flex-1 min-w-0" aria-label="Головне меню">
            <div
              ref={navScrollRef}
              className="flex items-center gap-1 overflow-x-auto overflow-y-visible scroll-smooth whitespace-nowrap no-scrollbar px-8"
            >
              {data.navigation?.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => scrollNavBy("left")}
              aria-label="Прокрутити ліворуч"
              className={`absolute left-0 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 border border-[hsl(80_15%_88%)] shadow-card transition-opacity ${
                showScrollLeft
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mx-auto text-dark" />
            </button>
            <button
              type="button"
              onClick={() => scrollNavBy("right")}
              aria-label="Прокрутити праворуч"
              className={`absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 border border-[hsl(80_15%_88%)] shadow-card transition-opacity ${
                showScrollRight
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <ChevronRight className="w-4 h-4 mx-auto text-dark" />
            </button>
          </nav>
        </div>

        {data.social && data.social.length > 0 && (
          <div className="hidden lg:flex items-center gap-2">
            {data.social.map((s: SocialLink) => {
              const iconUrl = getStrapiMedia(s.icon?.url);
              return (
                <a
                  key={s.id}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:translate-y-[-4px] transition-all bg-primary"
                  aria-label="Соціальні мережі"
                >
                  {iconUrl && (
                    <Image
                      src={iconUrl}
                      alt={s.icon?.alternativeText ?? ""}
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain"
                    />
                  )}
                </a>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-xl hover:bg-[hsl(80_30%_93%)] transition-colors"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Закрити меню" : "Відкрити меню"}
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`lg:hidden border-t border-[hsl(80_15%_88%)] bg-white transition-all duration-300 ease-in-out ${
          mobileOpen
            ? "opacity-100 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
            : "opacity-0 overflow-hidden"
        }`}
        aria-hidden={!mobileOpen}
        style={{
          maxHeight: mobileOpen
            ? `calc(100dvh - ${mobileMenuMaxHeight}px)`
            : "0px",
        }}
      >
        <nav className="container py-2" aria-label="Мобільне меню">
          {data.navigation?.map((item) => (
            <MobileNavItem
              key={item.id}
              item={item}
              onClose={() => setMobileOpen(false)}
            />
          ))}

          {data.social && data.social.length > 0 && (
            <div className="flex gap-3 px-4 py-4 mt-2">
              {data.social.map((s: SocialLink) => {
                const iconUrl = getStrapiMedia(s.icon?.url);
                return (
                  <a
                    key={s.id}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:translate-y-[-4px] transition-all bg-primary"
                    aria-label="Соціальні мережі"
                  >
                    {iconUrl && (
                      <Image
                        src={iconUrl}
                        alt={s.icon?.alternativeText ?? ""}
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
