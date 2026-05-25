import {
  LayoutDashboard,
  FileText,
  FolderTree,
  MessageSquare,
  Calendar,
  CalendarPlus,
  Users,
  Inbox,
  Image as ImageIcon,
  Heart,
  Quote,
  Settings,
  Building2,
  type LucideIcon,
} from "lucide-react"

export type NavGroup = "main" | "content" | "operations" | "cms" | "account"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  group: NavGroup
  requires?: "staff" | "admin"
}

export const GROUP_LABELS: Record<NavGroup, string> = {
  main: "",
  content: "Content",
  operations: "Operations",
  cms: "Site",
  account: "Account",
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, group: "main" },

  { label: "Publications", href: "/dashboard/publications", icon: FileText, group: "content" },
  { label: "Categories", href: "/dashboard/publication-categories", icon: FolderTree, group: "content" },
  { label: "Comments", href: "/dashboard/comments", icon: MessageSquare, group: "content" },
  { label: "Events", href: "/dashboard/events", icon: Calendar, group: "content" },
  { label: "Event categories", href: "/dashboard/event-categories", icon: CalendarPlus, group: "content" },

  { label: "Help requests", href: "/dashboard/help-requests", icon: Inbox, group: "operations", requires: "admin" },
  { label: "Users", href: "/dashboard/users", icon: Users, group: "operations", requires: "admin" },

  { label: "Gallery", href: "/dashboard/gallery", icon: ImageIcon, group: "cms" },
  { label: "Sponsors", href: "/dashboard/sponsors", icon: Heart, group: "cms" },
  { label: "Testimonials", href: "/dashboard/testimonials", icon: Quote, group: "cms" },
  { label: "App data", href: "/dashboard/app-data", icon: Building2, group: "cms", requires: "admin" },

  { label: "Profile", href: "/dashboard/profile", icon: Settings, group: "account" },
]

export function filterNavForUser(
  items: NavItem[],
  user: { is_staff: boolean; is_superuser: boolean } | null,
): NavItem[] {
  if (!user) return []
  return items.filter(item => {
    if (item.requires === "admin") return user.is_superuser
    if (item.requires === "staff") return user.is_staff
    return true
  })
}

export function groupNavItems(items: NavItem[]): Record<NavGroup, NavItem[]> {
  return items.reduce<Record<NavGroup, NavItem[]>>(
    (acc, item) => {
      acc[item.group] ||= []
      acc[item.group].push(item)
      return acc
    },
    { main: [], content: [], operations: [], cms: [], account: [] },
  )
}
