'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'

import type { PageParent } from '@/types/strapi'

interface Props {
  currentTitle: string
  parent?: PageParent | null
}

function buildChain(node: PageParent | null | undefined): PageParent[] {
  if (!node) return []
  return [...buildChain(node.parent_page), node]
}

export default function Breadcrumbs({ currentTitle, parent }: Props) {
  const chain = buildChain(parent)

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      aria-label="Хлібні крихти"
      className="flex items-center gap-1.5 flex-wrap text-sm text-primary-foreground/70"
    >
      <Link href="/" className="flex items-center gap-1 hover:text-primary-foreground transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span className="text-[11px] md:text-sm lg:text-[15px]">Головна</span>
      </Link>

      {chain.map((node) => (
        <span key={node.id} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <Link
            href={`/${node.slug}`}
            className="text-[11px] md:text-sm lg:text-[15px] hover:text-primary-foreground transition-colors"
          >
            {node.title}
          </Link>
        </span>
      ))}

      <span className="flex items-center gap-1.5">
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        <span className="text-[11px] md:text-sm lg:text-[15px] text-primary-foreground font-semibold">
          {currentTitle}
        </span>
      </span>
    </motion.nav>
  )
}
