"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LogoProps {
  isLink?: boolean
  isDark?: boolean
  textClassName?: string
}

const Logo = ({ isLink = true, isDark = true, textClassName = "" }: LogoProps) => {
  const inner = (
    <span className="flex flex-row-reverse items-center gap-2.5">
      <span
        className={cn(
          "hidden text-lg font-serif font-semibold tracking-tight md:block",
          isDark ? "text-primary" : "text-white",
          textClassName,
        )}
      >
        ABU Law Clinic
      </span>
      <Image
        src="/images/logo/logo.png"
        alt="ABU Law Clinic"
        width={40}
        height={40}
        priority
      />
    </span>
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {isLink ? <Link href="/">{inner}</Link> : inner}
    </motion.div>
  )
}

export default Logo
