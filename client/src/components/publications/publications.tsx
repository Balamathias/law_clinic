"use client"

import { Publication } from '@/@types/db'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PublicationCard from './publication-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  X, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Newspaper,
  Calendar,
  BookOpen,
  ArrowDownAZ,
  ArrowUpAZ,
  List,
  Grid3x3 
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  publications: Publication[],
  count: number,
  pageSize: number,
}

type ViewMode = 'grid' | 'list'
type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a'

const Publications = ({ publications, count, pageSize }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  
  const currentPage = Number(searchParams.get('page') || '1')
  const totalPages = Math.ceil(count / pageSize)
  
  // Reset to page 1 when search changes
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '')
  }, [searchParams])
  
  // Handle search submission
  const handleSearch = () => {
    setIsLoading(true)
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set('q', searchQuery)
    } else {
      params.delete('q')
    }
    params.set('page', '1') // Reset to first page on new search
    router.push(`/blog?${params.toString()}`)
    
    // Simulate loading state for better UX
    setTimeout(() => setIsLoading(false), 500)
  }
  
  // Handle search key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.push(`/blog?${params.toString()}`)
  }
  
  // Pagination navigation
  const navigateToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    
    setIsLoading(true)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/blog?${params.toString()}`)
    
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Simulate loading state for better UX
    setTimeout(() => setIsLoading(false), 300)
  }
  
  // Create pagination array with ellipses
  const getPaginationItems = () => {
    const items = []
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      items.push(1)
      
      if (currentPage > 3) {
        items.push('ellipsis')
      }
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        items.push(i)
      }
      
      if (currentPage < totalPages - 2) {
        items.push('ellipsis')
      }
      
      items.push(totalPages)
    }
    
    return items
  }
  
  // Handle sort change
  const handleSortChange = (value: SortOption) => {
    setSortOption(value)
    // In a full implementation, this would update the URL params and trigger a new fetch
  }
  
  // Handle view mode toggle
  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode)
  }
  
  // Toggle filter
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter))
    } else {
      setActiveFilters([...activeFilters, filter])
    }
    // In a full implementation, this would update the URL params and trigger a new fetch
  }
  
  // Get sort icon
  const getSortIcon = () => {
    switch (sortOption) {
      case 'newest': return <Calendar className="h-4 w-4 mr-2" />
      case 'oldest': return <Calendar className="h-4 w-4 mr-2" />
      case 'a-z': return <ArrowDownAZ className="h-4 w-4 mr-2" />
      case 'z-a': return <ArrowUpAZ className="h-4 w-4 mr-2" />
    }
  }
  
  if (publications.length === 0) {
    return (
      <div className="w-full flex flex-col items-center py-20">
        <div className="mb-6">
          <FileText className="h-12 w-12 text-muted-foreground opacity-30" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No publications found</h2>
        <p className="text-muted-foreground mb-6">
          {searchParams.get('q') 
            ? `No results for "${searchParams.get('q')}"`
            : "There are no publications available at the moment."}
        </p>
        {searchParams.get('q') && (
          <Button variant="outline" onClick={clearSearch}>
            Clear search
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-primary/80 to-primary p-6 md:p-10">
        <div className="absolute inset-0 bg-[url(/images/blog-pattern.png)] opacity-10"></div>
        <div className="relative z-10 max-w-3xl">
          <Badge className="bg-primary-foreground text-primary mb-4">Publications</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Latest Publications</h1>
          <p className="text-primary-foreground/90 text-lg mb-6">
            Explore our collection of articles, research papers, and legal insights
          </p>
          
          {/* Search bar */}
          <div className={cn(
            "relative rounded-full transition-all duration-200 border-2",
            isSearchFocused
              ? "border-primary-foreground shadow-lg"
              : "border-primary-foreground/40"
          )}>
            <Input
              placeholder="Search publications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyDown={handleKeyDown}
              className="rounded-full border-0 pl-5 pr-12 py-6 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {searchQuery ? (
              <button
                onClick={clearSearch}
                className="absolute right-14 top-2.5 text-primary-foreground/60 hover:text-primary-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
            <Button 
              onClick={handleSearch}
              className="absolute right-1.5 top-1.5 rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              size="sm"
            >
              <Search className="h-4 w-4 mr-1" />
              <span>Search</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Controls & Filters Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            {searchParams.get('q')
              ? `Search results for "${searchParams.get('q')}"`
              : "All Publications"}
          </h2>
          <p className="text-muted-foreground text-sm">
            Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, count)} of {count} publications
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                {getSortIcon()}
                <span className="hidden sm:inline">Sort by: </span>
                {sortOption === 'newest' && 'Newest'}
                {sortOption === 'oldest' && 'Oldest'}
                {sortOption === 'a-z' && 'A-Z'}
                {sortOption === 'z-a' && 'Z-A'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Sort publications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className={cn("gap-2 cursor-pointer", sortOption === 'newest' && "font-medium")}
                onClick={() => handleSortChange('newest')}
              >
                <Calendar className="h-4 w-4" />
                Newest first
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={cn("gap-2 cursor-pointer", sortOption === 'oldest' && "font-medium")}
                onClick={() => handleSortChange('oldest')}
              >
                <Calendar className="h-4 w-4" />
                Oldest first
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={cn("gap-2 cursor-pointer", sortOption === 'a-z' && "font-medium")}
                onClick={() => handleSortChange('a-z')}
              >
                <ArrowDownAZ className="h-4 w-4" />
                Alphabetical A-Z
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={cn("gap-2 cursor-pointer", sortOption === 'z-a' && "font-medium")}
                onClick={() => handleSortChange('z-a')}
              >
                <ArrowUpAZ className="h-4 w-4" />
                Alphabetical Z-A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Filter</span>
                {activeFilters.length > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['Legal Research', 'Case Studies', 'Legal Education', 'Human Rights'].map((category) => (
                <DropdownMenuItem 
                  key={category}
                  className="gap-2 cursor-pointer flex items-center"
                  onClick={() => toggleFilter(category)}
                >
                  <div className={cn(
                    "w-4 h-4 border rounded flex items-center justify-center mr-2",
                    activeFilters.includes(category) 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "border-muted-foreground"
                  )}>
                    {activeFilters.includes(category) && (
                      <svg width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                    )}
                  </div>
                  {category}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Publication type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {['Articles', 'Research Papers', 'Case Notes'].map((type) => (
                <DropdownMenuItem 
                  key={type}
                  className="gap-2 cursor-pointer flex items-center"
                  onClick={() => toggleFilter(type)}
                >
                  <div className={cn(
                    "w-4 h-4 border rounded flex items-center justify-center mr-2",
                    activeFilters.includes(type) 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "border-muted-foreground"
                  )}>
                    {activeFilters.includes(type) && (
                      <svg width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                    )}
                  </div>
                  {type}
                </DropdownMenuItem>
              ))}
              
              {activeFilters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-center text-xs h-8 mt-1"
                    onClick={() => setActiveFilters([])}
                  >
                    Clear all filters
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* View mode toggle */}
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button 
              variant={viewMode === 'grid' ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none px-2 h-8"
              onClick={() => toggleViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
              <span className="sr-only">Grid View</span>
            </Button>
            <Button 
              variant={viewMode === 'list' ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none px-2 h-8"
              onClick={() => toggleViewMode('list')}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List View</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {activeFilters.map(filter => (
            <Badge 
              key={filter} 
              variant="secondary"
              className="px-3 py-1 gap-1"
            >
              {filter}
              <button onClick={() => toggleFilter(filter)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setActiveFilters([])}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Publications grid or list */}
      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}
            >
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md h-full border border-gray-100">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-5">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {publications.map((publication, index) => (
                <PublicationCard 
                  key={publication.id} 
                  publication={publication} 
                  index={index} 
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {publications.map((publication, index) => (
                <motion.div
                  key={publication.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.07 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <PublicationCard 
                    publication={publication} 
                    index={index} 
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <Button 
          variant="outline" 
          size="sm" 
          disabled={currentPage === 1}
          onClick={() => navigateToPage(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>
        
        {getPaginationItems().map((item, index) => (
          <Button 
            key={index}
            variant={item === currentPage ? "secondary" : "ghost"}
            size="sm"
            onClick={() => typeof item === 'number' && navigateToPage(item)}
            disabled={item === 'ellipsis'}
          >
            {item === 'ellipsis' ? '...' : item}
          </Button>
        ))}
        
        <Button 
          variant="outline" 
          size="sm" 
          disabled={currentPage === totalPages}
          onClick={() => navigateToPage(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  )
}

export default Publications