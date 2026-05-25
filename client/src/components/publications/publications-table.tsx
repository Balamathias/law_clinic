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
  User,
  ArrowRight
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
import { Card } from '@/components/ui/card'
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
      <Card className="w-full p-12 text-center border border-dashed border-border/80 bg-muted/10 rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground border border-border/30">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-foreground">No publications found</h3>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            There are no publications to display at the moment. Add your first article to get started.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/65 backdrop-blur-md shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/40 bg-muted/30 hover:bg-muted/40 transition-colors">
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-4">Title & Details</TableHead>
            <TableHead className="hidden md:table-cell font-semibold text-foreground text-xs uppercase tracking-wider py-4">Category</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold text-foreground text-xs uppercase tracking-wider py-4">Author</TableHead>
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider py-4">Status</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold text-foreground text-xs uppercase tracking-wider py-4">Published Date</TableHead>
            <TableHead className="text-right font-semibold text-foreground text-xs uppercase tracking-wider py-4 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {publications?.map((publication) => (
            <TableRow key={publication.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors duration-200">
              <TableCell className="py-4 font-medium pl-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border border-border/40 shadow-2xs rounded-xl shrink-0 overflow-hidden">
                    <AvatarImage 
                      src={publication.featured_image || ''} 
                      alt={publication.title} 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary rounded-xl">
                      <FileText className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-serif text-base font-semibold leading-snug mb-1 text-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => handlePublicationAction(publication, 'view')}>
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
                  <Badge variant="outline" className="bg-muted/40 hover:bg-muted/50 border-border/50 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    <Layers className="size-3 mr-1 text-primary/70" />
                    {publication.category_name}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground font-medium">Uncategorized</span>
                )}
              </TableCell>

              <TableCell className="hidden lg:table-cell py-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <User className="size-3.5 text-primary/60" />
                  {publication.author?.email ? publication.author.email.split('@')[0] : "System"}
                </div>
              </TableCell>

              <TableCell className="py-4">
                <Badge variant={publication.status === 'published' ? "default" : "outline"} 
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${publication.status === 'published' 
                    ? 'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/15 border-green-300/20' 
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/15 border-amber-300/20'}`}
                >
                  <span className={cn("size-1.5 rounded-full mr-1.5 shrink-0", publication.status === 'published' ? "bg-green-500" : "bg-amber-500")} />
                  {publication.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>

              <TableCell className="hidden lg:table-cell py-4 text-muted-foreground text-xs font-semibold">
                {publication.status === 'published' ? (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary/70" />
                    {formatDate(publication.published_at)}
                  </div>
                ) : (
                  <span className="text-muted-foreground/60 italic font-normal">Not published</span>
                )}
              </TableCell>

              <TableCell className="text-right py-4 pr-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted/70">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px] rounded-xl border-border/50 shadow-md">
                    <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/40" />
                    <DropdownMenuItem onClick={() => handlePublicationAction(publication, 'view')}
                      className="cursor-pointer font-medium text-xs rounded-lg py-1.5"
                    >
                      <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>View Article</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePublicationAction(publication, 'edit')}
                      className="cursor-pointer font-medium text-xs rounded-lg py-1.5"
                    >
                      <Edit className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>Edit Article</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/40" />
                    <DropdownMenuItem 
                      onClick={() => handlePublicationAction(publication, 'delete')}
                      className="text-destructive focus:text-destructive cursor-pointer font-medium text-xs rounded-lg py-1.5"
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/10">
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
              className="h-8 w-8 p-0 rounded-lg hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-xs font-semibold text-foreground px-2">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0 rounded-lg hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!publicationToDelete} onOpenChange={() => setPublicationToDelete(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-semibold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed mt-2">
              Are you sure you want to delete the publication{' '}
              <span className="font-semibold text-foreground">
                "{publicationToDelete?.title}"
              </span>?
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setPublicationToDelete(null)} className="rounded-xl font-semibold text-xs">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} className="rounded-xl font-semibold text-xs">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PublicationsTable
