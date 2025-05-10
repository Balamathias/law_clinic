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
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.85,
    }),
    active: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    outgoing: (direction: number) => ({
      x: direction > 0 ? -500 : 500,
      opacity: 0,
      scale: 0.85,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    }),
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy')
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
    <section className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 w-full h-full opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.2) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-20">
          {/* Left Column - Text and Upcoming Events */}
          <div className="lg:w-5/12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 sm:mb-10"
            >
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full inline-flex items-center text-sm font-medium mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                Workshops & Events
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                Highlight Events<br />& Workshops
              </h2>
              <div className="h-1 w-20 bg-primary mb-6"></div>
              <p className="text-gray-600 text-lg">
                Join us at our upcoming events and workshops to learn about important legal topics, 
                receive free consultations, and connect with our community of legal professionals.
              </p>
            </motion.div>
            
            {/* Upcoming Events List */}
            <div className="space-y-4 mt-6 sm:mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Upcoming Events
              </h3>
              
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 3).map((event, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-wrap sm:flex-nowrap items-center gap-3"
                    >
                      <div className="bg-gray-100 h-12 w-12 flex-shrink-0 rounded-md flex flex-col items-center justify-center">
                        <span className="text-xs font-medium text-gray-500">
                          {formatDate((event.start_date))}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatTime((event.end_date))}
                        </span>
                      </div>
                      
                      <div className="flex-grow min-w-0 w-[calc(100%-60px)] sm:w-auto">
                        <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                      
                      <div className={`${categoryColors[event?.category_name as any] || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded-full whitespace-nowrap mt-2 sm:mt-0`}>
                        {event.category_name}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No upcoming events at the moment. Check back soon!</p>
              )}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="pt-4 mt-2"
              >
                <Button asChild className="text-primary bg-transparent hover:bg-primary/5 border border-primary/20">
                  <Link href="#!" className="flex items-center">
                    View All Events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Right Column - Featured Event Showcase */}
          <div className="lg:w-7/12 mt-8 lg:mt-0">
            <div className="relative min-h-[450px] sm:min-h-[500px] md:min-h-[550px] lg:min-h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 pb-4">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="incoming"
                  animate="active"
                  exit="outgoing"
                  className="absolute inset-0 flex flex-col"
                >
                  <div className="relative w-full aspect-[16/9] sm:aspect-[16/8] md:h-[250px] lg:h-[300px]">
                    <Image 
                      src={currentEvent?.image || '/images/highlights/default.jpg'}
                      alt={currentEvent?.title || "Event image"}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
                  </div>
                  
                  <div className="p-4 sm:p-6 relative flex-grow overflow-y-auto">
                    <div className={`${categoryColors[currentEvent?.category_name as any] || 'bg-primary'} absolute right-4 sm:right-6 top-0 -translate-y-1/2 text-white px-4 py-2 rounded-full font-medium text-sm`}>
                      {currentEvent?.category_name}
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold mt-4 mb-3 text-gray-900">{currentEvent?.title}</h3>
                    
                    <div className="flex flex-wrap gap-y-3 gap-x-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5 text-primary flex-shrink-0" />
                        {formatDate((currentEvent?.start_date))}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1.5 text-primary flex-shrink-0" />
                        {formatTime((currentEvent?.start_date))}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1.5 text-primary flex-shrink-0" />
                        <span className="truncate">{currentEvent?.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-5 text-sm">
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {formatTime((currentEvent?.end_date))}
                      </div>
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        {currentEvent?.max_participants} attendees
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 line-clamp-2 sm:line-clamp-3 md:line-clamp-none md:max-h-24 overflow-y-auto">{currentEvent?.description}</p>
                    
                    <div className="flex flex-wrap items-center justify-between gap-y-4">
                      <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                        <Link href={`#${currentEvent?.id}`}>
                          Register Now
                        </Link>
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={prevSlide}
                          className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={nextSlide}
                          className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Event counter indicator */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                {activeIndex + 1} / {events.length}
              </div>
            </div>
            
            {/* Dots navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {events.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > activeIndex ? 1 : -1);
                    setActiveIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
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
