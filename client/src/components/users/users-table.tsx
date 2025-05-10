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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from '@/components/ui/card'

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

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return
    
    try {
      // API call to delete user would go here
      // await deleteUser(userToDelete.id)
      console.log(`Deleting user: ${userToDelete.id}`)
      setUserToDelete(null)
      // Refresh data or show success message
    } catch (error) {
      console.error('Failed to delete user:', error)
      // Show error message
    }
  }

  const getInitials = (user: User) => {
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || user.email[0].toUpperCase()
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleColor = (user: User) => {
    if (user.is_superuser) return "bg-primary/20 text-primary border-primary/30"
    if (user.is_staff) return "bg-blue-500/10 text-blue-600 border-blue-300/30 dark:text-blue-400"
    return "bg-secondary/50"
  }

  if (users.length === 0) {
    return (
      <Card className="w-full p-12 text-center bg-background/50">
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
    <Card className="w-full overflow-hidden shadow-sm">
      <Table>
        <TableCaption>List of registered users in the system</TableCaption>
        <TableHeader>
          <TableRow className="bg-secondary/20 hover:bg-secondary/30 dark:bg-muted/50 dark:hover:bg-muted/60">
            <TableHead className="w-[280px]">User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Role</TableHead>
            <TableHead className="hidden lg:table-cell">Joined</TableHead>
            <TableHead className="hidden lg:table-cell">Last Active</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/30 transition-all duration-150">
              <TableCell className="py-4 font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border shadow-sm">
                    <AvatarImage className='object-cover' src={user.avatar || ''} alt={`${user.first_name || ''} ${user.last_name || ''}`} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium leading-none mb-1">{user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}` 
                      : user.username || user.email.split('@')[0]}
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {user.username || '—'}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-foreground/80">{user.email}</span>
              </TableCell>
              <TableCell>
                <Badge variant={user.is_active ? "default" : "destructive"} 
                  className={`${user.is_active 
                    ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400 border border-green-300/30' 
                    : 'border border-destructive/30'}`}
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="outline" className={`${getRoleColor(user)}`}>
                  {user.is_superuser ? 'Admin' : user.is_staff ? 'Staff' : 'User'}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                {formatDate(user.date_joined)}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                {formatDate(user.last_login)}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px] animate-in zoom-in-50 duration-200">
                    <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleUserAction(user, 'view')}
                      className="cursor-pointer"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View User</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUserAction(user, 'edit')}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit User</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleUserAction(user, 'delete')}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
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
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * pageSize, count)}</span> of{' '}
            <span className="font-medium">{count}</span> users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="flex items-center text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user{' '}
              <span className="font-medium">
                {userToDelete?.first_name && userToDelete?.last_name 
                  ? `${userToDelete.first_name} ${userToDelete.last_name}` 
                  : userToDelete?.email}
              </span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default UsersTable