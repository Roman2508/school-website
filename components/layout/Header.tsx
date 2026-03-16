"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react"
import { getStrapiMedia } from "@/lib/strapi"
import type { HeaderData, NavItemLevel1, NavItemLevel2, SocialLink } from "@/types/strapi"

// ─── Desktop: Level 2 sub-dropdown ───────────────────

function Level2Dropdown({ items }: { items: NavItemLevel2[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div className="absolute top-full left-0 min-w-[220px] bg-white rounded-2xl shadow-card-hover border border-[hsl(80_15%_88%)] py-2 z-50">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="relative group/l2"
          onMouseEnter={() => setActiveIndex(i)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <Link
            href={item.link}
            className="flex items-center justify-between px-4 py-2.5 text-sm text-dark hover:text-[hsl(84_55%_45%)] hover:bg-[hsl(80_30%_93%)] transition-colors"
          >
            <span>{item.text}</span>
            {item.submenu && item.submenu.length > 0 && <ChevronRight className="w-3.5 h-3.5 ml-2 opacity-50" />}
          </Link>
          {/* Level 3 */}
          {item.submenu && item.submenu.length > 0 && activeIndex === i && (
            <div className="absolute top-0 left-full min-w-[220px] bg-white rounded-2xl shadow-card-hover border border-[hsl(80_15%_88%)] py-2 z-50">
              {item.submenu.map((leaf) => (
                <Link
                  key={leaf.id}
                  href={leaf.link}
                  className="block px-4 py-2.5 text-sm text-dark hover:text-[hsl(84_55%_45%)] hover:bg-[hsl(80_30%_93%)] transition-colors"
                >
                  {leaf.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Desktop: Level 1 nav item with dropdown ─────────

function NavItem({ item }: { item: NavItemLevel1 }) {
  const [open, setOpen] = useState(false)
  const hasChildren = item.submenu && item.submenu.length > 0

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href={item.link}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-dark hover:text-[hsl(84_55%_45%)] hover:bg-[hsl(80_30%_93%)] rounded-xl transition-colors"
      >
        {item.title}
        {hasChildren && (
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 opacity-60 ${open ? "rotate-180" : ""}`}
          />
        )}
      </Link>
      {hasChildren && open && item.submenu && <Level2Dropdown items={item.submenu} />}
    </div>
  )
}

// ─── Mobile: Accordion nav item ───────────────────────

function MobileNavItem({ item, onClose }: { item: NavItemLevel1; onClose: () => void }) {
  const [open, setOpen] = useState(false)
  const [openL2, setOpenL2] = useState<number | null>(null)
  const hasChildren = item.submenu && item.submenu.length > 0

  return (
    <div className="border-b border-[hsl(80_15%_88%)] last:border-0">
      <div className="flex items-center justify-between">
        <Link
          href={item.link}
          onClick={onClose}
          className="flex-1 px-4 py-3 text-sm font-semibold text-dark hover:text-[hsl(84_55%_45%)] transition-colors"
        >
          {item.title}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setOpen(!open)}
            className="p-3 text-[hsl(0_0%_40%)] hover:text-[hsl(84_55%_45%)] transition-colors"
            aria-label={open ? "Згорнути" : "Розгорнути"}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {hasChildren && open && item.submenu && (
        <div className="bg-[hsl(80_20%_97%)] px-4 pb-2">
          {item.submenu.map((l2, idx) => (
            <div key={l2.id}>
              <div className="flex items-center justify-between">
                <Link
                  href={l2.link}
                  onClick={onClose}
                  className="flex-1 py-2 pl-3 text-sm text-dark hover:text-[hsl(84_55%_45%)] transition-colors"
                >
                  {l2.text}
                </Link>
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
                  {l2.submenu.map((leaf) => (
                    <Link
                      key={leaf.id}
                      href={leaf.link}
                      onClick={onClose}
                      className="block py-1.5 text-sm text-[hsl(0_0%_40%)] hover:text-[hsl(84_55%_45%)] transition-colors"
                    >
                      {leaf.text}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Header component ────────────────────────────

export default function Header({ data }: { data: HeaderData }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  // Close mobile menu on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setMobileOpen(false)
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const logoUrl = getStrapiMedia(data.logo?.url)

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[hsl(80_15%_88%)]"
    >
      {/* Top banner */}
      {data.title && (
        <div className="bg-stats-gradient text-center py-2 px-4">
          <p className="text-sm font-medium text-white">{data.title}</p>
        </div>
      )}

      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
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
              <span className="text-white font-heading font-black text-xl">Ш</span>
            </div>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Головне меню">
          {data.navigation?.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>

        {/* Desktop socials */}
        {data.social && data.social.length > 0 && (
          <div className="hidden lg:flex items-center gap-2">
            {data.social.map((s: SocialLink) => {
              const iconUrl = getStrapiMedia(s.icon?.url)
              return (
                <a
                  key={s.id}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-[hsl(80_15%_88%)] hover:border-[hsl(84_55%_45%)] hover:bg-[hsl(80_30%_93%)] transition-all"
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
              )
            })}
          </div>
        )}

        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-xl hover:bg-[hsl(80_30%_93%)] transition-colors"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Закрити меню" : "Відкрити меню"}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden border-t border-[hsl(80_15%_88%)] bg-white overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav className="container py-2" aria-label="Мобільне меню">
          {data.navigation?.map((item) => (
            <MobileNavItem key={item.id} item={item} onClose={() => setMobileOpen(false)} />
          ))}

          {/* Mobile socials */}
          {data.social && data.social.length > 0 && (
            <div className="flex gap-3 px-4 py-4 border-t border-[hsl(80_15%_88%)] mt-2">
              {data.social.map((s: SocialLink) => {
                const iconUrl = getStrapiMedia(s.icon?.url)
                return (
                  <a
                    key={s.id}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-[hsl(80_15%_88%)] hover:border-[hsl(84_55%_45%)] hover:bg-[hsl(80_30%_93%)] transition-all"
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
                )
              })}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
