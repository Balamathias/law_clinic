'use client'

import { Publication } from '@/@types/db'
import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  FileText,
  Calendar,
  Layers,
  User
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  publications: Publication[],
  count: number,
  pageSize?: number
}

const PublicationsTable = ({ publications, count, pageSize = 10 }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page') || '1')
  const [publicationToDelete, setPublicationToDelete] = useState<Publication | null>(null)
  
  const totalPages = Math.ceil(count / pageSize)

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const handlePublicationAction = (publication: Publication, action: 'view' | 'edit' | 'delete') => {
    switch (action) {
      case 'view':
        router.push(`/dashboard/publications/${publication.id}`)
        break
      case 'edit':
        router.push(`/dashboard/publications/${publication.id}/edit`)
        break
      case 'delete':
        setPublicationToDelete(publication)
        break
    }
  }

  const handleDeleteConfirm = async () => {
    if (!publicationToDelete) return
    
    try {
      console.log(`Deleting publication: ${publicationToDelete.id}`)
      setPublicationToDelete(null)
    } catch (error) {
      console.error('Failed to delete publication:', error)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength = 80) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (publications?.length === 0) {
    return (
      <div className="w-full p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl">
        <div className="flex flex-col items-center justify-center gap-3">
          <AlertCircle className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
          <h3 className="font-sans text-sm font-semibold text-zinc-900 dark:text-zinc-50">No publications found</h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs leading-relaxed">
            There are no publications to display at the moment. Add your first article to get started.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-50/50">
            <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-widest py-3 pl-6">Title & Details</TableHead>
            <TableHead className="hidden md:table-cell font-semibold text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-widest py-3">Category</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-widest py-3">Author</TableHead>
            <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-widest py-3">Status</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-widest py-3">Published Date</TableHead>
            <TableHead className="text-right font-semibold text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-widest py-3 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {publications?.map((publication) => (
            <TableRow key={publication.id} className="border-b border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors duration-150">
              <TableCell className="py-4 font-medium pl-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800 rounded-lg shrink-0 overflow-hidden">
                    <AvatarImage 
                      src={publication.featured_image || ''} 
                      alt={publication.title} 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 rounded-lg">
                      <FileText className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-sans text-sm font-semibold leading-snug mb-1 text-zinc-900 dark:text-zinc-50 hover:underline cursor-pointer" onClick={() => handlePublicationAction(publication, 'view')}>
                      {publication.title}
                    </div>
                    <div className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
                      {publication.excerpt ? truncateText(publication.excerpt) : truncateText(publication.content?.replace(/<[^>]*>/g, ''))}
                    </div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="hidden md:table-cell py-4">
                {publication.category_name ? (
                  <Badge variant="outline" className="bg-zinc-50/50 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md">
                    <Layers className="size-3 mr-1 text-zinc-400" />
                    {publication.category_name}
                  </Badge>
                ) : (
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">Uncategorized</span>
                )}
              </TableCell>

              <TableCell className="hidden lg:table-cell py-4">
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                  <User className="size-3.5 text-zinc-400" />
                  {publication.author?.email ? publication.author.email.split('@')[0] : "System"}
                </div>
              </TableCell>

              <TableCell className="py-4">
                <Badge variant={publication.status === 'published' ? "default" : "outline"} 
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${publication.status === 'published' 
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' 
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'}`}
                >
                  <span className={cn("size-1.5 rounded-full mr-1.5 shrink-0", publication.status === 'published' ? "bg-emerald-500" : "bg-zinc-400 dark:bg-zinc-500")} />
                  {publication.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>

              <TableCell className="hidden lg:table-cell py-4 text-zinc-400 dark:text-zinc-500 text-[11px] font-medium">
                {publication.status === 'published' ? (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    {formatDate(publication.published_at)}
                  </div>
                ) : (
                  <span className="text-zinc-400/60 dark:text-zinc-500/60 italic font-normal">Not published</span>
                )}
              </TableCell>

              <TableCell className="text-right py-4 pr-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900">
                      <MoreHorizontal className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[150px] rounded-lg border-zinc-200 dark:border-zinc-800 shadow-md bg-white dark:bg-zinc-950">
                    <DropdownMenuLabel className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 px-2.5 py-1.5">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                    <DropdownMenuItem onClick={() => handlePublicationAction(publication, 'view')}
                      className="cursor-pointer font-medium text-xs rounded-md py-1.5 px-2.5"
                    >
                      <Eye className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                      <span>View Article</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePublicationAction(publication, 'edit')}
                      className="cursor-pointer font-medium text-xs rounded-md py-1.5 px-2.5"
                    >
                      <Edit className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                      <span>Edit Article</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                    <DropdownMenuItem 
                      onClick={() => handlePublicationAction(publication, 'delete')}
                      className="text-rose-600 focus:text-rose-600 cursor-pointer font-medium text-xs rounded-md py-1.5 px-2.5"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-900/5">
          <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
            Showing <span className="text-zinc-900 dark:text-zinc-50">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
            <span className="text-zinc-900 dark:text-zinc-50">{Math.min(currentPage * pageSize, count)}</span> of{' '}
            <span className="text-zinc-900 dark:text-zinc-50">{count}</span> publications
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-7 w-7 p-0 rounded-md border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 px-1">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-7 w-7 p-0 rounded-md border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!publicationToDelete} onOpenChange={() => setPublicationToDelete(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="font-sans text-base font-semibold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed mt-1">
              Are you sure you want to delete the publication{' '}
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                "{publicationToDelete?.title}"
              </span>?
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setPublicationToDelete(null)} className="rounded-lg font-medium text-xs h-8 border-zinc-200 dark:border-zinc-800">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} className="rounded-lg font-medium text-xs h-8 bg-rose-600 hover:bg-rose-500 text-white">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PublicationsTable
