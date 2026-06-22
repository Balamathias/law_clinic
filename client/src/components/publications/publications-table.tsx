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
import { useDeletePublication } from '@/services/client/publications'
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

  const { mutate: deletePublicationMut } = useDeletePublication()

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const handlePublicationAction = (publication: Publication, action: 'view' | 'edit' | 'delete') => {
    switch (action) {
      case 'view':
        router.push(`/publications/${publication.slug || publication.id}`)
        break
      case 'edit':
        router.push(`/dashboard/publications/${publication.id}`)
        break
      case 'delete':
        setPublicationToDelete(publication)
        break
    }
  }

  const handleDeleteConfirm = () => {
    if (!publicationToDelete) return
    
    deletePublicationMut(publicationToDelete.id, {
      onSuccess: () => {
        setPublicationToDelete(null)
      }
    })
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
      <div className="w-full p-12 text-center border border-dashed border-border bg-muted/20 rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-3">
          <AlertCircle className="w-6 h-6 text-muted-foreground" />
          <h3 className="text-sm font-bold text-foreground">No publications found</h3>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            There are no publications to display at the moment. Add your first article to get started.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider py-3.5 pl-6">Title & Details</TableHead>
            <TableHead className="hidden md:table-cell font-bold text-muted-foreground text-[10px] uppercase tracking-wider py-3.5">Category</TableHead>
            <TableHead className="hidden lg:table-cell font-bold text-muted-foreground text-[10px] uppercase tracking-wider py-3.5">Author</TableHead>
            <TableHead className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider py-3.5">Status</TableHead>
            <TableHead className="hidden lg:table-cell font-bold text-muted-foreground text-[10px] uppercase tracking-wider py-3.5">Published Date</TableHead>
            <TableHead className="text-right font-bold text-muted-foreground text-[10px] uppercase tracking-wider py-3.5 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {publications?.map((publication) => (
            <TableRow key={publication.id} className="group border-b border-border/80 hover:bg-muted/40 transition-colors duration-150">
              <TableCell className="py-4 font-medium pl-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-9 w-9 border border-border rounded-xl shrink-0 overflow-hidden shadow-xs">
                    <AvatarImage 
                      src={publication.featured_image || ''} 
                      alt={publication.title} 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground rounded-xl">
                      <FileText className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div 
                      className="font-serif text-sm font-bold leading-snug mb-1 text-foreground hover:underline cursor-pointer group-hover:text-primary transition-colors" 
                      onClick={() => handlePublicationAction(publication, 'view')}
                    >
                      {publication.title}
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {publication.excerpt ? truncateText(publication.excerpt) : truncateText(publication.content?.replace(/<[^>]*>/g, ''))}
                    </div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="hidden md:table-cell py-4">
                {publication.category_name ? (
                  <Badge variant="outline" className="bg-muted/40 border-border text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg">
                    <Layers className="size-3 mr-1 text-muted-foreground" />
                    {publication.category_name}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground font-medium">Uncategorized</span>
                )}
              </TableCell>

              <TableCell className="hidden lg:table-cell py-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                  <User className="size-3.5 text-muted-foreground" />
                  {publication.author?.email ? publication.author.email.split('@')[0] : "System"}
                </div>
              </TableCell>

              <TableCell className="py-4">
                <Badge variant="outline" 
                  className={cn(
                    "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider",
                    publication.status === 'published' 
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                  )}
                >
                  <span className={cn("size-1.5 rounded-full mr-1.5 shrink-0", publication.status === 'published' ? "bg-emerald-500" : "bg-amber-500")} />
                  {publication.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>

              <TableCell className="hidden lg:table-cell py-4 text-muted-foreground text-xs font-semibold">
                {publication.status === 'published' ? (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatDate(publication.published_at)}
                  </div>
                ) : (
                  <span className="text-muted-foreground/60 italic font-normal">Not published</span>
                )}
              </TableCell>

              <TableCell className="text-right py-4 pr-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-xl hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[150px] rounded-2xl border-border shadow-md bg-card">
                    <DropdownMenuLabel className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground px-2.5 py-1.5">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem onClick={() => handlePublicationAction(publication, 'view')}
                      className="cursor-pointer font-semibold text-xs rounded-xl py-1.5 px-2.5"
                    >
                      <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>View Article</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePublicationAction(publication, 'edit')}
                      className="cursor-pointer font-semibold text-xs rounded-xl py-1.5 px-2.5"
                    >
                      <Edit className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>Edit Article</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem 
                      onClick={() => handlePublicationAction(publication, 'delete')}
                      className="text-rose-600 focus:text-rose-600 cursor-pointer font-semibold text-xs rounded-xl py-1.5 px-2.5"
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
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-muted/20">
          <div className="text-xs text-muted-foreground font-semibold">
            Showing <span className="text-foreground">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
            <span className="text-foreground">{Math.min(currentPage * pageSize, count)}</span> of{' '}
            <span className="text-foreground">{count}</span> publications
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 w-8 p-0 rounded-xl border-border hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-xs font-bold text-muted-foreground px-1">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0 rounded-xl border-border hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!publicationToDelete} onOpenChange={() => setPublicationToDelete(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-serif text-base font-bold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
              Are you sure you want to delete the publication{' '}
              <span className="font-bold text-foreground">
                "{publicationToDelete?.title}"
              </span>?
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setPublicationToDelete(null)} className="rounded-xl font-bold text-xs h-8 border-border">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} className="rounded-xl font-bold text-xs h-8 bg-rose-600 hover:bg-rose-500 text-white">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PublicationsTable
