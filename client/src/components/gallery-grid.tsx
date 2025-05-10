'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { 
  Filter, 
  Grid as GridIcon, 
  LayoutGrid, 
  LayoutList, 
  Search,
  CalendarClock,
  X,
  Loader2
} from 'lucide-react'

import { Gallery as GalleryType } from '@/@types/db'
import { cn } from '@/lib/utils'
import Gallery from './gallery'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"

interface GalleryGridProps {
  galleries: GalleryType[]
  loading?: boolean
  className?: string
  showFilters?: boolean
  defaultLayout?: 'grid' | 'masonry' | 'carousel'
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  galleries,
  loading = false,
  className = '',
  showFilters = true,
  defaultLayout = 'grid'
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeYear, setActiveYear] = useState<number | null>(null)
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const [filteredGalleries, setFilteredGalleries] = useState<GalleryType[]>(galleries)
  const [layout, setLayout] = useState<'grid' | 'masonry' | 'carousel'>(defaultLayout)
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false)
  
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    let result = [...galleries]
    
    if (searchTerm) {
      result = result.filter(
        gallery => 
          gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (gallery.description && gallery.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    if (activeYear !== null) {
      result = result.filter(gallery => gallery.year === activeYear)
    }
    
    if (activeDepartment) {
      result = result.filter(gallery => gallery.department === activeDepartment)
    }
    
    if (!showArchived) {
      result = result.filter(gallery => !gallery.is_previous)
    }
    
    setFilteredGalleries(result)
  }, [galleries, searchTerm, activeYear, activeDepartment, showArchived])

  // Extract available years and departments for filters
  const years = Array.from(new Set(galleries.map(g => g.year).filter(Boolean) as number[])).sort((a, b) => b - a)
  const departments = Array.from(new Set(galleries.map(g => g.department)))

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  }

  const getLayoutIcon = () => {
    switch(layout) {
      case 'grid': return <GridIcon className="h-4 w-4" />;
      case 'masonry': return <LayoutGrid className="h-4 w-4" />;
      case 'carousel': return <LayoutList className="h-4 w-4" />;
      default: return <GridIcon className="h-4 w-4" />;
    }
  }

  return (
    <div className={cn("relative space-y-8", className)}>
      {/* Gallery Filter Controls */}
      {showFilters && (
        <>
          {/* Desktop Filters */}
          <div className="hidden md:block">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Input
                    placeholder="Search galleries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  {searchTerm && (
                    <button 
                      className="absolute right-3 top-2.5" 
                      onClick={() => setSearchTerm('')}
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filter Galleries</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs text-muted-foreground">By Year</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className={cn("flex items-center justify-between", !activeYear && "bg-accent text-accent-foreground")}
                          onClick={() => setActiveYear(null)}
                        >
                          All years
                          {!activeYear && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        </DropdownMenuItem>
                        {years.map(year => (
                          <DropdownMenuItem 
                            key={year} 
                            className={cn("flex items-center justify-between", activeYear === year && "bg-accent text-accent-foreground")}
                            onClick={() => setActiveYear(year)}
                          >
                            {year}
                            {activeYear === year && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs text-muted-foreground">By Department</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className={cn("flex items-center justify-between", !activeDepartment && "bg-accent text-accent-foreground")}
                          onClick={() => setActiveDepartment(null)}
                        >
                          All departments
                          {!activeDepartment && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        </DropdownMenuItem>
                        {departments.map(dept => (
                          <DropdownMenuItem 
                            key={dept} 
                            className={cn("flex items-center justify-between", activeDepartment === dept && "bg-accent text-accent-foreground")}
                            onClick={() => setActiveDepartment(dept)}
                          >
                            {dept.charAt(0).toUpperCase() + dept.slice(1)}
                            {activeDepartment === dept && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        className="flex items-center justify-between"
                        onClick={() => setShowArchived(!showArchived)}
                      >
                        <span>Show archived galleries</span>
                        <div className={cn(
                          "h-4 w-8 rounded-full transition-colors", 
                          showArchived ? "bg-primary" : "bg-muted"
                        )}>
                          <div className={cn(
                            "h-3 w-3 rounded-full bg-white transform transition-transform mt-0.5", 
                            showArchived ? "translate-x-4 ml-0.5" : "translate-x-0.5"
                          )} />
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        {getLayoutIcon()}
                        <span className="sr-only md:not-sr-only md:inline-block">Layout</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className={cn("flex items-center gap-2", layout === 'grid' && "bg-accent text-accent-foreground")}
                        onClick={() => setLayout('grid')}
                      >
                        <GridIcon className="h-4 w-4" />
                        Grid
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={cn("flex items-center gap-2", layout === 'masonry' && "bg-accent text-accent-foreground")}
                        onClick={() => setLayout('masonry')}
                      >
                        <LayoutGrid className="h-4 w-4" />
                        Masonry
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={cn("flex items-center gap-2", layout === 'carousel' && "bg-accent text-accent-foreground")}
                        onClick={() => setLayout('carousel')}
                      >
                        <LayoutList className="h-4 w-4" />
                        Carousel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Active filters */}
              {(activeYear !== null || activeDepartment || searchTerm || showArchived) && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Active filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {activeYear !== null && (
                      <span className="bg-secondary/80 text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                        <CalendarClock className="h-3.5 w-3.5" />
                        Year: {activeYear}
                        <button onClick={() => setActiveYear(null)}>
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    )}
                    {activeDepartment && (
                      <span className="bg-secondary/80 text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                        Department: {activeDepartment.charAt(0).toUpperCase() + activeDepartment.slice(1)}
                        <button onClick={() => setActiveDepartment(null)}>
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    )}
                    {showArchived && (
                      <span className="bg-secondary/80 text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                        Including archived
                        <button onClick={() => setShowArchived(false)}>
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    )}
                    {(activeYear !== null || activeDepartment || showArchived) && (
                      <button 
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                        onClick={() => {
                          setActiveYear(null)
                          setActiveDepartment(null)
                          setShowArchived(false)
                        }}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Mobile Filters */}
          <div className="md:hidden">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search galleries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  {searchTerm && (
                    <button 
                      className="absolute right-3 top-2.5" 
                      onClick={() => setSearchTerm('')}
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setIsFilterMobileOpen(!isFilterMobileOpen)}
                  className={isFilterMobileOpen ? "bg-accent" : ""}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <Collapsible 
                open={isFilterMobileOpen} 
                onOpenChange={setIsFilterMobileOpen}
                className="mb-4"
              >
                <CollapsibleContent className="space-y-4 pt-2">
                  {/* Year tabs */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Filter by Year</h3>
                    <div className="flex flex-wrap gap-1">
                      <Button
                        size="sm"
                        variant={activeYear === null ? "default" : "outline"}
                        onClick={() => setActiveYear(null)}
                        className="text-xs h-7 px-2"
                      >
                        All
                      </Button>
                      {years.map(year => (
                        <Button
                          key={year}
                          size="sm"
                          variant={activeYear === year ? "default" : "outline"}
                          onClick={() => setActiveYear(year)}
                          className="text-xs h-7 px-2"
                        >
                          {year}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Department tabs */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Filter by Department</h3>
                    <div className="flex flex-wrap gap-1">
                      <Button
                        size="sm"
                        variant={activeDepartment === null ? "default" : "outline"}
                        onClick={() => setActiveDepartment(null)}
                        className="text-xs h-7 px-2"
                      >
                        All
                      </Button>
                      {departments.map(dept => (
                        <Button
                          key={dept}
                          size="sm"
                          variant={activeDepartment === dept ? "default" : "outline"}
                          onClick={() => setActiveDepartment(dept)}
                          className="text-xs h-7 px-2"
                        >
                          {dept.charAt(0).toUpperCase() + dept.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Show archived toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show archived galleries</span>
                    <button 
                      onClick={() => setShowArchived(!showArchived)}
                      className={cn(
                        "h-6 w-11 rounded-full transition-colors flex items-center px-1", 
                        showArchived ? "bg-primary justify-end" : "bg-muted justify-start"
                      )}
                    >
                      <div className="h-4 w-4 rounded-full bg-white" />
                    </button>
                  </div>
                  
                  {/* Layout options */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Layout</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={layout === 'grid' ? "default" : "outline"}
                        onClick={() => setLayout('grid')}
                        className="gap-1.5"
                      >
                        <GridIcon className="h-3.5 w-3.5" /> Grid
                      </Button>
                      <Button
                        size="sm"
                        variant={layout === 'masonry' ? "default" : "outline"}
                        onClick={() => setLayout('masonry')}
                        className="gap-1.5"
                      >
                        <LayoutGrid className="h-3.5 w-3.5" /> Masonry
                      </Button>
                      <Button
                        size="sm"
                        variant={layout === 'carousel' ? "default" : "outline"}
                        onClick={() => setLayout('carousel')}
                        className="gap-1.5"
                      >
                        <LayoutList className="h-3.5 w-3.5" /> Carousel
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Active filters (mobile) */}
              {(activeYear !== null || activeDepartment || showArchived) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeYear !== null && (
                    <span className="bg-secondary/80 text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1 text-xs">
                      {activeYear}
                      <button onClick={() => setActiveYear(null)}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}
                  {activeDepartment && (
                    <span className="bg-secondary/80 text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1 text-xs">
                      {activeDepartment}
                      <button onClick={() => setActiveDepartment(null)}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}
                  {showArchived && (
                    <span className="bg-secondary/80 text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1 text-xs">
                      Archive
                      <button onClick={() => setShowArchived(false)}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}
                  <button 
                    className="text-primary hover:text-primary/80 text-xs font-medium"
                    onClick={() => {
                      setActiveYear(null)
                      setActiveDepartment(null)
                      setShowArchived(false)
                    }}
                  >
                    Clear all
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary/70 mb-4" />
          <p className="text-muted-foreground">Loading galleries...</p>
        </div>
      ) : filteredGalleries.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-10 text-center border border-dashed border-border rounded-lg"
        >
          <div className="flex flex-col items-center justify-center p-8">
            <div className="bg-muted rounded-full p-4 mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No galleries found</h3>
            <p className="text-muted-foreground max-w-sm">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            {(searchTerm || activeYear !== null || activeDepartment || showArchived) && (
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchTerm('')
                  setActiveYear(null)
                  setActiveDepartment(null)
                  setShowArchived(false)
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        </motion.div>
      ) : (
        <div ref={ref}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-16"
          >
            {filteredGalleries.map((gallery) => (
              <motion.div key={gallery.id} variants={itemVariants} className="group">
                <Gallery 
                  gallery={gallery} 
                  gridLayout={layout === 'grid' ? 'default' : layout === 'masonry' ? 'masonry' : 'carousel'}
                  enableLightbox 
                  showSocialLinks
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default GalleryGrid
