import React from 'react'
import { LucideScale } from 'lucide-react'
import Link from 'next/link'
import { Delius } from 'next/font/google';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion'
import Image from 'next/image'

const delius = Delius({weight: ['400', '400'], subsets: ['latin'], variable: '--font-delius'});

const Logo = ({ isLink=true, isDark=true, textClassName="" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Link href="/" className="flex items-center space-x-2 flex-row-reverse gap-1.5">
        <span className={cn(`text-xl font-bold hidden md:block ${isDark ? 'text-primary' : 'text-white text-shadow'}`, textClassName)}>
          ABU Law Clinic
        </span>
        <Image
          src="/images/logo/logo.png"
          alt="ABU Law Clinic Logo"
          width={50}
          height={50}
          className=""
        />
      </Link>
    </motion.div>
  )
}

export default Logo
