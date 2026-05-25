"use client"

import Link from "next/link"
import { LogOut, User as UserIcon, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "nextjs-toploader/app"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogout } from "@/services/client/auth"
import type { User } from "@/@types/db"

interface Props {
  user: User
}

export default function UserMenu({ user }: Props) {
  const { mutate: logout, isPending: loggingOut } = useLogout()
  const router = useRouter()

  const initial =
    user.first_name?.charAt(0) ||
    user.username?.charAt(0) ||
    user.email?.charAt(0) ||
    "U"

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: (data) => {
        if (data?.error) {
          toast.error(data.message)
          return
        }
        toast.success("Signed out")
        router.replace("/")
        router.refresh()
      },
      onError: (error: Error) => toast.error(error.message),
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md p-1 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Open account menu"
        >
          <Avatar className="size-7">
            <AvatarImage src={user.avatar ?? undefined} alt="" className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-xs text-primary">{initial.toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate text-sm font-medium">
            {user.first_name ? `${user.first_name} ${user.last_name ?? ""}`.trim() : user.username ?? "User"}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="cursor-pointer">
            <UserIcon className="size-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/" className="cursor-pointer">
            <ExternalLink className="size-4" />
            <span>View site</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={loggingOut} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="size-4" />
          <span>{loggingOut ? "Signing out…" : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
