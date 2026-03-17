'use client'

import { motion } from 'framer-motion'

import { formatRichText } from '@/lib/utils'

interface Props {
  title: string
  subtitle?: string | null
}

export default function HeroTitle({ title, subtitle }: Props) {
  return (
    <div className="text-center w-full max-w-6xl mx-auto absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-heading text-2xl min-[500px]:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 leading-tight px-5"
      >
        {formatRichText(title)}
      </motion.h1>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-sm min-[500px]:text-base md:text-lg lg:text-xl text-primary-foreground/80 mx-auto px-5"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
