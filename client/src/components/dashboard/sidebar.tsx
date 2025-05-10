'use client'

import React, { useState } from 'react'
import { 
  Home, 
  BookOpen, 
  Search, 
  BookMarked, 
  Settings, 
  LogOut,
  Users,
  Sparkles,
  MessageSquare,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Shield,
  LucideScale,
  ArrowRight,
  Crown,
  Calendar,
  Image
} from "lucide-react"
import Logo from '../logo'
import { Button } from '../ui/button'
import { useLogout } from '@/services/client/auth'
import { toast } from 'sonner'
import { useRouter } from 'nextjs-toploader/app'
import { User } from '@/@types/db'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export const dashboardLinks = [
  {
    tooltip: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    tooltip: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    tooltip: "Publications",
    href: "/dashboard/publications",
    icon: BookOpen,
  },
  {
    tooltip: "Events",
    href: "/dashboard/events",
    icon: Calendar,
  },
  {
    tooltip: "Gallery",
    href: "/dashboard/gallery",
    icon: Image,
  },
  {
    tooltip: "Sponsors",
    href: "/dashboard/sponsors",
    icon: Shield
  },
  {
    tooltip: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    tooltip: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: Crown,
  },
]

interface Props {
  user: User | null
}

const DashboardSidebar = ({ user }: Props) => {
  const { mutate: logout, isPending: loggingOut } = useLogout()
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const handleLogout = () => {
    logout(undefined, {
      onSuccess: (data) => {
        if (data?.error) {
          toast.error(data.message)
          return
        }

        toast.success('Logged out successfully')
        router.replace('/')
        router.refresh()
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  // Sidebar navigation links
  const NavLinks = () => (
    <nav className='flex flex-col gap-1 overflow-y-auto'>
      {dashboardLinks.map((link, index) => {
        // Fix isActive logic to avoid marking parent routes as active
        const isActive = 
          pathname === link.href || 
          (pathname.startsWith(`${link.href}/`) && link.href !== "/dashboard");
        
        return (
          <Link 
            key={index} 
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
              isActive
                ? "bg-primary/10 text-primary font-medium shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: isActive ? 1.1 : 1 }}
              className={cn(
                "flex items-center justify-center", 
                isActive && "text-primary"
              )}
            >
              <link.icon className={cn("h-4 w-4", isActive && "stroke-[2.5px]")} />
            </motion.div>
            
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm whitespace-nowrap overflow-hidden"
                >
                  {link.tooltip}
                </motion.span>
              )}
            </AnimatePresence>
            
            {isActive && !isCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
              />
            )}
          </Link>
        )
      })}
    </nav>
  )

  // User profile and logout
  const UserProfile = () => (
    <div className="flex flex-col gap-2">
      <div className={cn(
        "rounded-lg p-2.5 bg-accent/50",
        isCollapsed ? "items-center justify-center" : "flex items-center gap-3"
      )}>
        {isCollapsed ? (
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={user?.avatar || ''} className='object-cover' />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        ) : (
          <>
            <Avatar className="h-9 w-9 border border-border shrink-0">
              <AvatarImage src={user?.avatar || ''} className='object-cover' />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium truncate">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </>
        )}
      </div>
      
      {
        user ? (
          <Button 
            className={cn(
              "rounded-lg transition-all", 
              isCollapsed ? "w-10 h-10 p-0" : "w-full gap-2",
              loggingOut && "opacity-70"
            )}
            variant="default"
            size={isCollapsed ? "icon" : "sm"}
            onClick={handleLogout}
            disabled={loggingOut}
            title="Logout"
          >
            {!isCollapsed && (
              <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
            )}
            <LogOut className='w-4 h-4' />
          </Button>
        ): (
          <Button 
            className={cn(
              "rounded-lg transition-all", 
              isCollapsed ? "w-10 h-10 p-0" : "w-full gap-2",
              loggingOut && "opacity-70"
            )}
            variant="default"
            size={isCollapsed ? "icon" : "sm"}
            onClick={handleLogout}
            disabled={loggingOut}
            title="Login"
          >
            {!isCollapsed && (
              <span>Login</span>
            )}
            <ArrowRight className='w-4 h-4' />
          </Button>
        )
      }
    </div>
  )

  // Desktop Sidebar
  return (
    <motion.div 
      layout
      className={cn(
        'h-screen flex-col bg-background backdrop-blur-sm p-2.5 hidden lg:flex fixed left-0 bottom-0 top-0 border-r border-border shadow-sm z-30 transition-all',
        isCollapsed ? 'w-[70px]' : 'w-[220px]'
      )}
      animate={{ width: isCollapsed ? 70 : 220 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo and Collapse button */}
        <div className={cn(
          "flex items-center py-2.5 px-2 mb-6",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && <Logo textClassName='text-lg' />}
          {isCollapsed && <span className="font-bold text-xl">
            <LucideScale />
          </span>}
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full border border-border/50 opacity-70 hover:opacity-100"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <NavLinks />
        </div>
        
        {/* User Profile and Logout */}
        <div className="mt-auto pt-4 border-t border-border">
          <UserProfile />
        </div>
      </div>
    </motion.div>
  )
}

export default DashboardSidebar