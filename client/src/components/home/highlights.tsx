"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  Calendar, 
  ArrowRight, 
  MapPin, 
  Clock, 
  Users, 
  Tag,
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format, parseISO, isFuture } from 'date-fns'
import { Event } from '@/@types/db'

interface Props {
  events: Event[]
}

const Highlights = ({ events }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  // Filter upcoming events and sort by date
  const upcomingEvents = [...events].sort((a, b) => {
    return new Date(a?.start_date).getTime() - new Date(b?.start_date).getTime();
  }).filter(event => isFuture(parseISO(event?.start_date)));

  const currentEvent = events[activeIndex];
  
  const categoryColors: Record<string, string> = {
    "Workshop": "bg-emerald-500",
    "Conference": "bg-blue-500",
    "Event": "bg-purple-500",
    "Seminar": "bg-amber-500",
  };
  
  const slideVariants = {
    incoming: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    active: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    outgoing: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    }),
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy')
    } catch (e) {
      return 'Unknown date'
    }
  }

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a')
    } catch (e) {
      return 'Unknown time'
    }
  }

  return (
    <section className="py-8 sm:py-12 lg:py-20 relative overflow-hidden" id="events">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 w-full h-full opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.2) 1px, transparent 0)",
          backgroundSize: "30px 30px",
        }}></div>
        <div className="absolute -top-10 -left-10 sm:-top-20 sm:-left-20 w-40 h-40 sm:w-80 sm:h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 sm:-bottom-20 sm:-right-20 w-40 h-40 sm:w-80 sm:h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 relative z-10">
        <div className="flex flex-col xl:flex-row gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
          {/* Left Column - Text and Upcoming Events */}
          <div className="xl:w-5/12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 sm:mb-8 lg:mb-10"
            >
              <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full inline-flex items-center text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Workshops & Events
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900">
                Highlight Events<br className="hidden sm:block" />
                <span className="sm:hidden">& </span>
                <span className="hidden sm:inline">& </span>Workshops
              </h2>
              <div className="h-1 w-16 sm:w-20 bg-primary mb-4 sm:mb-6"></div>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                Join us at our upcoming events and workshops to learn about important legal topics, 
                receive free consultations, and connect with our community of legal professionals.
              </p>
            </motion.div>
            
            {/* Upcoming Events List */}
            <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6 lg:mt-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                Upcoming Events
              </h3>
              
              {upcomingEvents.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {upcomingEvents.slice(0, 3).map((event, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-50 h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded-lg flex flex-col items-center justify-center border">
                          <span className="text-xs font-bold text-primary">
                            {format(new Date(event.start_date), 'MMM')}
                          </span>
                          <span className="text-sm sm:text-base font-bold text-gray-900">
                            {format(new Date(event.start_date), 'd')}
                          </span>
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-1 mb-1">{event.title}</h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span>{formatTime(event.start_date)}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`${categoryColors[event?.category_name as any] || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0`}>
                          {event.category_name}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm sm:text-base">No upcoming events at the moment. Check back soon!</p>
              )}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="pt-3 sm:pt-4"
              >
                <Button asChild size="sm" className="text-primary bg-transparent hover:bg-primary/5 border border-primary/20 w-full sm:w-auto">
                  <Link href="#!" className="flex items-center justify-center">
                    View All Events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Right Column - Featured Event Showcase */}
          <div className="xl:w-7/12 w-full mt-6 sm:mt-8 xl:mt-0">
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="incoming"
                  animate="active"
                  exit="outgoing"
                  className="flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80">
                    <Image 
                      src={currentEvent?.image || '/images/highlights/default.jpg'}
                      alt={currentEvent?.title || "Event image"}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 42vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                    
                    {/* Navigation Buttons - Mobile */}
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-4 pointer-events-none">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevSlide}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors shadow-lg pointer-events-auto"
                      >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextSlide}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors shadow-lg pointer-events-auto"
                      >
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.button>
                    </div>
                    
                    {/* Counter */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                      {activeIndex + 1} / {events.length}
                    </div>
                    
                    {/* Category Badge */}
                    <div className={`${categoryColors[currentEvent?.category_name as any] || 'bg-primary'} absolute top-3 sm:top-4 right-3 sm:right-4 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm`}>
                      {currentEvent?.category_name}
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-4 sm:p-6 flex-grow">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 line-clamp-2">{currentEvent?.title}</h3>
                    
                    {/* Event Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                        <span className="truncate">{formatDate(currentEvent?.start_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                        <span>{formatTime(currentEvent?.start_date)}</span>
                      </div>
                      <div className="flex items-center sm:col-span-2 lg:col-span-1">
                        <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                        <span className="truncate">{currentEvent?.location}</span>
                      </div>
                    </div>
                    
                    {/* Additional Info */}
                    <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-5 text-sm">
                      <div className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-md flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Ends: {formatTime(currentEvent?.end_date)}
                      </div>
                      <div className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-md flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        {currentEvent?.max_participants} attendees
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm sm:text-base mb-6 line-clamp-3 sm:line-clamp-4 leading-relaxed">{currentEvent?.description}</p>
                    
                    {/* Action Button */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <Button asChild className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
                        <Link href={`#${currentEvent?.id}`} className="text-center">
                          Register Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Dots Navigation */}
            <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
              {events.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > activeIndex ? 1 : -1);
                    setActiveIndex(idx);
                  }}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-200 ${
                    idx === activeIndex 
                      ? 'bg-primary scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to event ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Highlights;
