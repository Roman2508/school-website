"use client"

import { motion } from "framer-motion"
import { formatRichText } from "@/lib/utils"

interface Props {
  title: string
  subtitle?: string | null
}

export default function HeroTitle({ title, subtitle }: Props) {
  return (
    <div className="text-center w-full max-w-6xl mx-auto absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      {/* top-[calc(50% + 50px)] */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-dark mb-4 leading-tight"
      >
        {formatRichText(title)}
      </motion.h1>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
