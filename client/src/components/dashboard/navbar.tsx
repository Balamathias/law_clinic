'use client'

import React, { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Logo from '../logo'
import { User } from '@/@types/db'
import { usePathname } from 'next/navigation'
import { useLogout } from '@/services/client/auth'
import { useRouter } from 'nextjs-toploader/app'
import { toast } from 'sonner'
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from '../ui/sheet'
import { 
  Home, 
  BookOpen, 
  Search, 
  BookMarked, 
  Settings, 
  LogOut,
  Users,
  Sparkles,
  ShieldAlert,
  Shield,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'
import { dashboardLinks } from './sidebar'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

interface NavbarProps {
  user: User | null
}

// Mobile sidebar component
const MobileSidebar = ({ user }: { user: User | null }) => {
  const { mutate: logout, isPending: loggingOut } = useLogout()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  
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
        setOpen(false)
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }
  
  const handleNavigate = (href: string) => {
    router.push(href)
    setOpen(false)
  }
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
      <Avatar className="h-10 w-10 border border-border">
        <AvatarImage src={user?.avatar || ''} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-sm w-[85%] p-0">
        <div className="flex flex-col h-full overflow-hidden">
          <SheetHeader className="px-5 py-4 border-b border-border">
            <div className="flex justify-between items-center">
              <Logo />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full" 
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {user && (
              <div className="flex items-center gap-3 mt-5 pb-2">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={user?.avatar || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <SheetTitle className="text-left text-base truncate">
                    {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'User'}
                  </SheetTitle>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            )}
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <nav className="flex flex-col gap-1">
              {dashboardLinks.map((link, index) => {
                // Fix isActive logic to avoid marking parent routes as active
                const isActive = 
                  pathname === link.href || 
                  (pathname.startsWith(`${link.href}/`) && link.href !== "/dashboard");
                
                return (
                  <button
                    key={index}
                    onClick={() => handleNavigate(link.href)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2.5 transition-all",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "rounded-lg p-2",
                        isActive ? "bg-primary/10" : "bg-muted"
                      )}>
                        <link.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm">{link.tooltip}</span>
                    </div>
                    
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
              
              {user && (user.is_staff || user.is_superuser) && (
                <button
                  onClick={() => handleNavigate('/admin')}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 transition-all mt-2 border-t border-border pt-4",
                    pathname.startsWith('/admin')
                      ? "bg-red-500/10 text-red-500 font-medium"
                      : "text-foreground hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "rounded-lg p-2",
                      pathname.startsWith('/admin') ? "bg-red-500/10" : "bg-muted"
                    )}>
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <span className="text-sm">Admin Dashboard</span>
                  </div>
                  
                  {pathname.startsWith('/admin') && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  )}
                </button>
              )}
            </nav>
          </div>
          
          <SheetFooter className="border-t border-border p-4">
            {user ? (
              <Button 
                className="w-full gap-2"
                variant="default"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <LogOut className="h-4 w-4" />
                <span>{loggingOut ? 'Logging out...' : 'Sign Out'}</span>
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  className="flex-1 gap-1"
                  onClick={() => router.push('/login')}
                >
                  Log In
                </Button>
                <Button 
                  className="flex-1 gap-1"
                  variant="outline"
                  onClick={() => router.push('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const Navbar = ({ user }: NavbarProps) => {
  const pathname = usePathname() 
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()
  
  useMotionValueEvent(scrollY, 'change', latest => {
    const prevValue = scrollY.getPrevious()
    
    if (latest > prevValue! && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  // Hide navbar on specific deep routes
  if (pathname.match(/\/dashboard\/(past-questions|bookmarks|search|chat|quizzes)\/[^/]+/)) {
    return null
  }

  return (
    <motion.nav
      initial={{ background: 'inherit' }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      animate={hidden ? "hidden" : "visible"}
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' }
      }}
      className="flex flex-row p-4 h-14 w-full fixed top-0 z-30 border-b bg-background/90 dark:bg-background/80 lg:hidden backdrop-blur-md"
    >
      <div className="flex flex-row justify-between items-center w-full mx-auto px-1">
        <Logo />
        
        <div className="items-center gap-2">
          {/* Account button - optional */}
          {/* {user && (
            <Button 
              variant="outline"
              size="sm"
              className="text-xs h-8 px-3 border-border/70 text-muted-foreground"
              onClick={() => window.location.href = '/dashboard/account'}
            >
              Account
            </Button>
          )} */}
          
          {/* Mobile menu trigger */}
          <MobileSidebar user={user} />
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar