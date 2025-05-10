"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Publication } from '@/@types/db'
import { format } from 'date-fns'

const PublicationCard = ({ publication, index }: { publication: Publication, index: number }) => {
  return (
    <motion.div
      className="group h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/publications/${publication.slug}`} className="block h-full">
        <div className="bg-white rounded-xl overflow-hidden shadow-md h-full flex flex-col border border-gray-100 transition-all duration-200 group-hover:shadow-xl">
          <div className="relative h-48 w-full overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url(${publication?.featured_image})` }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary/90 hover:bg-primary text-white text-xs px-2 py-1">
                {publication.categories?.map((cat) => cat.name).join(', ')}
              </Badge>
            </div>
          </div>
          
          <div className="p-5 flex-grow flex flex-col">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {publication.title}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-2">
              {publication.excerpt}
            </p>
            
            {/* Meta info */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <User size={12} />
                <span>{(publication.author?.first_name + ' ' + publication?.author?.last_name) || publication?.author?.email}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                    {publication?.created_at ? format(new Date(publication.created_at), 'MMMM d, yyyy') : 'Unknown'}
                </span>
                
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {publication?.mins_read} {publication?.mins_read === 1 ? 'min' : 'mins'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PublicationCard