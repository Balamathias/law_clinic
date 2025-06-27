"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock, User } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePublications } from '@/services/client/publications'
import { Publication } from '@/@types/db'
import { formatDate } from '@/lib/utils'

import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import PublicationCard from '../publications/publication-card'


const Publications = () => {
  const { data, isPending } = usePublications({ params: { limit: 6 } })

  const publications = data?.data?.slice(0, 6)

  if (isPending) {
    return <PublicationsSkeleton />
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              OUR<br />PUBLICATIONS
            </h2>
            <div className="mt-2 w-20 h-1 bg-primary"></div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:block"
          >
            <Button 
              variant="default" 
              className="bg-primary hover:bg-primary/90 rounded-full group px-6 "
              asChild
            >
              <Link href="/publications" className="flex items-center gap-2">
                SEE ALL
                <motion.div
                  className="transition-transform"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight size={16} />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications?.map((publication, index) => (
            <PublicationCard 
              key={publication.id} 
              publication={publication!} 
              index={index} 
            />
          ))}
        </div>
        
        {/* Mobile view "See All" button */}
        <motion.div
          className="mt-10 text-center md:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button 
            variant="default" 
            className="bg-primary hover:bg-primary/90 rounded-full"
            asChild
          >
            <Link href="/blog" className="flex items-center gap-2">
              View More Publications
              <ArrowRight size={16} />
            </Link>
          </Button>
        </motion.div>

        <div className="absolute -top-16 -left-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default Publications;

export const PublicationsSkeleton = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="group h-full">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
