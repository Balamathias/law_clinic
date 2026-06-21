'use client'

import { User } from '@/@types/db'
import React, { useState } from 'react'
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { useDeleteUser } from '@/services/client/users'

interface Props {
  users: User[],
  count: number,
  pageSize?: number
}

const UsersTable = ({ users, count, pageSize = 10 }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page') || '1')
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser()
  const totalPages = Math.ceil(count / pageSize)

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const handleUserAction = (user: User, action: 'view' | 'edit' | 'delete') => {
    switch (action) {
      case 'view':
        router.push(`/dashboard/users/${user.id}`)
        break
      case 'edit':
        router.push(`/dashboard/users/${user.id}/edit`)
        break
      case 'delete':
        setUserToDelete(user)
        break
    }
  }

  const handleDeleteConfirm = () => {
    if (!userToDelete) return
    deleteUser(userToDelete.id, {
      onSuccess: () => {
        setUserToDelete(null)
      }
    })
  }

  const getInitials = (user: User) => {
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || user.email[0].toUpperCase()
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleBadge = (user: User) => {
    if (user.is_superuser) {
      return (
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5">
          Admin
        </Badge>
      )
    }
    if (user.is_staff) {
      return (
        <Badge variant="outline" className="bg-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5">
          Staff
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 text-muted-foreground border-zinc-200 dark:border-zinc-700 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5">
        User
      </Badge>
    )
  }

  if (users.length === 0) {
    return (
      <Card className="w-full p-12 text-center bg-zinc-50/40 dark:bg-zinc-900/10 border-border">
        <div className="flex flex-col items-center justify-center gap-2">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No users found</h3>
          <p className="text-sm text-muted-foreground">
            There are no users to display at the moment.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 shadow-sm rounded-xl">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-50/70 hover:bg-zinc-50/70 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/30 border-b border-zinc-200/60 dark:border-zinc-800/60">
            <TableHead className="w-[280px] text-xs font-semibold uppercase tracking-wider text-zinc-500 py-3">User</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-500 py-3">Email</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-500 py-3">Status</TableHead>
            <TableHead className="hidden md:table-cell text-xs font-semibold uppercase tracking-wider text-zinc-500 py-3">Role</TableHead>
            <TableHead className="hidden lg:table-cell text-xs font-semibold uppercase tracking-wider text-zinc-500 py-3">Joined</TableHead>
            <TableHead className="hidden lg:table-cell text-xs font-semibold uppercase tracking-wider text-zinc-500 py-3">Last Active</TableHead>
            <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 py-3">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 border-b border-zinc-200/40 dark:border-zinc-800/40 transition-colors">
              <TableCell className="py-3.5 font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
                    <AvatarImage className='object-cover' src={user.avatar || ''} alt={`${user.first_name || ''} ${user.last_name || ''}`} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-50 leading-none mb-1">
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}` 
                        : user.username || user.email.split('@')[0]}
                    </div>
                    <div className="text-[11px] text-muted-foreground hidden sm:block font-medium">
                      @{user.username || '—'}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3.5 text-zinc-600 dark:text-zinc-300 text-sm font-medium">
                {user.email}
              </TableCell>
              <TableCell className="py-3.5">
                <Badge variant="outline" 
                  className={user.is_active 
                    ? 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5' 
                    : 'bg-rose-500/5 text-rose-600 border-rose-200/50 dark:border-rose-800/50 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5'}
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell py-3.5">
                {getRoleBadge(user)}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground text-xs py-3.5 font-medium">
                {formatDate(user.date_joined)}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground text-xs py-3.5 font-medium">
                {formatDate(user.last_login)}
              </TableCell>
              <TableCell className="text-center py-3.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                      <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px] border border-zinc-200/80 dark:border-zinc-800/80 shadow-md">
                    <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">User Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                    <DropdownMenuItem onClick={() => handleUserAction(user, 'view')}
                      className="cursor-pointer text-xs font-medium"
                    >
                      <Eye className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                      <span>View User</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUserAction(user, 'edit')}
                      className="cursor-pointer text-xs font-medium"
                    >
                      <Edit className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                      <span>Edit User</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                    <DropdownMenuItem 
                      onClick={() => handleUserAction(user, 'delete')}
                      className="text-rose-600 focus:text-rose-600 focus:bg-rose-500/5 cursor-pointer text-xs font-medium"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5 text-rose-400" />
                      <span>Delete User</span>
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/30 dark:bg-zinc-900/10">
          <div className="text-xs text-muted-foreground font-medium">
            Showing <span className="font-semibold text-zinc-700 dark:text-zinc-300">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{Math.min(currentPage * pageSize, count)}</span> of{' '}
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{count}</span> users
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 px-2.5 rounded-lg border-zinc-200/80 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 px-2.5 rounded-lg border-zinc-200/80 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent className="sm:max-w-[425px] border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Are you sure you want to delete the user{' '}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {userToDelete?.first_name && userToDelete?.last_name 
                  ? `${userToDelete.first_name} ${userToDelete.last_name}` 
                  : userToDelete?.email}
              </span>?
              This action cannot be undone and will permanently remove this user account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setUserToDelete(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default UsersTable