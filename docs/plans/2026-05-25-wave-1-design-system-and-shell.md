# Wave 1 — Design System & Shell Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **REQUIRED READING FIRST:** `2026-05-25-elegance-overhaul-design.md` (the north-star design doc). All sections referenced as §N.

**Goal:** Establish the design token system, swap fonts, build the public + dashboard component foundation, fix the middleware/RBAC bug, and ship a dashboard shell that feels like Linear.

**Architecture:** Tailwind v4 + CSS custom properties for tokens. Two font registers — `Fraunces` (public editorial) + `Inter` (UI everywhere). Dashboard `.dark` mode scoped via route group. shadcn/ui components rebuilt against new tokens. Middleware fixed to gate `/dashboard/*` on `is_staff`. RBAC helpers and 403 page introduced.

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind v4, shadcn/ui, Framer Motion, next-themes, Django 5 REST Framework, SimpleJWT.

**Out of scope for Wave 1:** Publications editor, R2 uploads, all CRUD pages beyond the shell. Those live in Waves 2 & 3.

---

## Task 0: Branch + worktree setup

**Step 1:** Create a worktree for Wave 1 work.
```bash
git worktree add ../law_clinic-wave-1 -b wave-1-design-system
cd ../law_clinic-wave-1
```

**Step 2:** Confirm clean state.
```bash
git status
```
Expected: `nothing to commit, working tree clean` on branch `wave-1-design-system`.

---

## Task 1: Fix the dashboard middleware security bug

**Why first:** The current `middleware.ts` matches `/dashboard/:path*` but its `protectedRoutes` array only contains `/finish-up` and `/admin`. Result: any unauthenticated user can hit `/dashboard/*` URLs. This is a real vulnerability. Fix before anything else.

**Files:**
- Modify: `client/src/middleware.ts`
- Create: `client/src/app/(403)/forbidden/page.tsx`
- Create: `client/src/app/(403)/layout.tsx`

**Step 1:** Replace `client/src/middleware.ts` entirely:

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUser } from './services/server/auth';

const AUTH_ROUTES = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];

// Routes that require a logged-in user (any tier).
const REQUIRES_AUTH = ['/finish-up'];

// Dashboard prefixes that require is_staff.
const STAFF_PREFIXES = ['/dashboard'];

// Dashboard sub-paths that require is_superuser (Admin).
const ADMIN_ONLY_PREFIXES = [
  '/dashboard/users',
  '/dashboard/help-requests',
  '/dashboard/app-data',
];

export async function middleware(request: NextRequest) {
  const { data: user } = await getUser();
  const path = request.nextUrl.pathname;

  // Logged-in users away from auth pages.
  if (user && AUTH_ROUTES.includes(path)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Auth-only routes.
  if (!user && REQUIRES_AUTH.some(p => path.startsWith(p))) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(path)}`, request.url));
  }

  // Dashboard requires is_staff.
  if (STAFF_PREFIXES.some(p => path.startsWith(p))) {
    if (!user) {
      return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(path)}`, request.url));
    }
    if (!user.is_staff) {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  // Admin-only routes.
  if (ADMIN_ONLY_PREFIXES.some(p => path.startsWith(p))) {
    if (!user?.is_superuser) {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/finish-up/:path*',
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
  ],
};
```

**Step 2:** Confirm `is_staff` exists on the user type. Check `client/src/@types/db.d.ts` — `is_staff` and `is_superuser` are both optional. **Modify** them to remove the `?` (we always need these set):

```ts
is_active: boolean,
is_staff: boolean,
is_superuser: boolean,
```

And confirm `services/server/auth.ts` `getUser()` returns these — open the file and verify the User serializer on the backend includes them. If not, fix the backend serializer in Task 1b.

**Step 1b (backend, conditional on Step 2 finding):** Open `server/app/serializers.py`, find the User serializer used by `/auth/user/`. Ensure `fields` includes `is_active`, `is_staff`, `is_superuser`.

**Step 3:** Create the 403 page.

`client/src/app/(403)/layout.tsx`:
```tsx
import SiteHeader from '@/components/site-header';
import Footer from '@/components/footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-180px)]">{children}</main>
      <Footer />
    </>
  );
}
```

`client/src/app/(403)/forbidden/page.tsx`:
```tsx
import Link from 'next/link';
import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Forbidden | ABU Law Clinic' };

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <ShieldOff className="mx-auto mb-6 size-12 text-ink-subtle" aria-hidden />
      <h1 className="text-h2 font-serif">You don't have access to this page</h1>
      <p className="mt-4 text-ink-muted">
        This area is restricted to clinic staff. If you believe this is a mistake, contact the clinic administrator.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild><Link href="/">Return home</Link></Button>
        <Button asChild variant="secondary"><Link href="/contact">Contact us</Link></Button>
      </div>
    </div>
  );
}
```

**Step 4:** Manual verification.
- Logged out → visit `/dashboard` → expect redirect to `/login?next=%2Fdashboard`.
- Logged in as non-staff → visit `/dashboard` → expect redirect to `/forbidden`.
- Logged in as staff (not superuser) → visit `/dashboard/users` → expect redirect to `/forbidden`.
- Logged in as superuser → visit `/dashboard/users` → loads.

**Step 5:** Commit.
```bash
git add client/src/middleware.ts client/src/app/\(403\) client/src/@types/db.d.ts server/app/serializers.py
git commit -m "fix(middleware): gate /dashboard on is_staff, add /forbidden page"
```

---

## Task 2: Install design dependencies

**Files:**
- Modify: `client/package.json`

**Step 1:** From `client/` run:
```bash
pnpm add isomorphic-dompurify @aws-sdk/client-s3 @aws-sdk/s3-request-presigner @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-typography next-themes @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers cmdk
```

Note: TipTap + R2 SDKs are installed now even though they're consumed in Wave 2 — having them present means Wave 1 dashboard shell can stub UI elements that reference them.

**Step 2:** Commit.
```bash
git add client/package.json client/pnpm-lock.yaml
git commit -m "chore: add design system + editor + upload deps"
```

---

## Task 3: Replace fonts in root layout

**Files:**
- Modify: `client/src/app/layout.tsx`
- Modify: `client/src/components/logo.tsx`

**Step 1:** Replace `client/src/app/layout.tsx` font imports:

```tsx
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});
```

Apply on `<body>`:
```tsx
<body className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen w-full relative bg-background text-ink`}>
```

Remove imports for `Geist`, `Geist_Mono`, `Lexend`, `Poppins`.

**Step 2:** Modify `client/src/components/logo.tsx`:
- Remove `import { Delius } from 'next/font/google'` and the `delius` const.
- Wordmark uses `font-serif` (Fraunces) for institutional feel.

```tsx
<span className={cn(`text-lg font-serif font-semibold hidden md:block ${isDark ? 'text-primary' : 'text-white'}`, textClassName)}>
  ABU Law Clinic
</span>
```

**Step 3:** Grep for stray font references:
```bash
grep -rE "Lexend|Geist|Poppins|Delius|font-lexend|font-geist|font-poppins|font-delius" client/src
```
Replace any remaining usages with `font-sans` or `font-serif` as appropriate.

**Step 4:** Commit.
```bash
git add client/src/app/layout.tsx client/src/components/logo.tsx
git commit -m "feat(design): replace fonts with Inter + Fraunces + JetBrains Mono"
```

---

## Task 4: Write the new globals.css token system

**Files:**
- Modify: `client/src/app/globals.css` (full replace)

**Step 1:** Replace entire file contents with the token system from **§3.1** of the design doc, plus Tailwind v4 directives:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: var(--font-inter);
  --font-serif: var(--font-fraunces);
  --font-mono: var(--font-mono);

  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-ink: var(--ink);
  --color-ink-muted: var(--ink-muted);
  --color-ink-subtle: var(--ink-subtle);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-danger: var(--danger);
  --color-info: var(--info);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  /* full block from §3.1 light tokens — copy verbatim */
}

.dark {
  /* full block from §3.1 dark tokens — copy verbatim */
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-ink font-sans; }
  ::selection { background: var(--brand-green-100); color: var(--ink); }
}

@layer utilities {
  .text-display { font-family: var(--font-serif); font-size: 4.5rem; line-height: 1.05; font-weight: 600; letter-spacing: -0.02em; }
  .text-h1 { font-family: var(--font-serif); font-size: 3rem; line-height: 1.1; font-weight: 600; letter-spacing: -0.015em; }
  .text-h2 { font-family: var(--font-serif); font-size: 2.25rem; line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; }
  .text-h3 { font-size: 1.5rem; line-height: 1.3; font-weight: 600; }
  .text-h4 { font-size: 1.25rem; line-height: 1.4; font-weight: 500; }
  .text-body { font-size: 1.0625rem; line-height: 1.65; }
  .text-small { font-size: 0.9375rem; line-height: 1.5; }
  .text-micro { font-size: 0.8125rem; line-height: 1.4; font-weight: 500; }

  .dashboard .text-h1 { font-family: var(--font-sans); font-size: 1.875rem; }
  .dashboard .text-h2 { font-family: var(--font-sans); font-size: 1.5rem; }
  .dashboard .text-body { font-size: 0.9375rem; line-height: 1.5; }

  .prose-editorial { max-width: 65ch; }
  .prose-editorial p { margin-block: 1em; }
  .prose-editorial h2 { @apply text-h2 mt-12 mb-4; }
  .prose-editorial h3 { @apply text-h3 mt-10 mb-3; }
  .prose-editorial a { color: var(--primary); text-decoration: underline; text-underline-offset: 3px; }
  .prose-editorial blockquote { @apply border-l-4 border-accent pl-4 italic text-ink-muted; }
  .prose-editorial pre { font-family: var(--font-mono); }
}
```

**Step 2:** Manual verification. Run dev server, load `/`. Expect:
- Body background is warm off-white (parchment).
- Headings render in Fraunces.
- Body in Inter.

**Step 3:** Commit.
```bash
git add client/src/app/globals.css
git commit -m "feat(design): introduce OKLCH token system + light/dark variants"
```

---

## Task 5: Rebuild core UI primitives against new tokens

**Files:**
- Modify: `client/src/components/ui/button.tsx`
- Modify: `client/src/components/ui/input.tsx`
- Modify: `client/src/components/ui/textarea.tsx`
- Modify: `client/src/components/ui/card.tsx`
- Modify: `client/src/components/ui/badge.tsx`
- Modify: `client/src/components/ui/dialog.tsx`
- Modify: `client/src/components/ui/dropdown-menu.tsx`
- Modify: `client/src/components/ui/select.tsx`
- Modify: `client/src/components/ui/checkbox.tsx`
- Modify: `client/src/components/ui/separator.tsx`
- Modify: `client/src/components/ui/sonner.tsx`

**Step 1:** Read each file, identify hard-coded colors (`bg-white`, `text-zinc-900`, etc.) and replace with token classes (`bg-surface`, `text-ink`, etc.).

**Step 2:** For `button.tsx` specifically, reduce to four variants and three sizes per **§4.2**:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "border border-border-strong bg-transparent text-ink hover:bg-surface-muted",
        ghost: "text-ink hover:bg-surface-muted",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-8 px-3 text-small",
        md: "h-10 px-4 text-body",
        lg: "h-12 px-6 text-body",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);
```

**Step 3:** For `input.tsx`, follow **§4.3**:

```tsx
<input
  className={cn(
    "flex h-10 w-full rounded-md border border-border bg-surface px-3 text-body text-ink placeholder:text-ink-subtle",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
    error && "border-danger focus-visible:ring-danger",
    className
  )}
  {...props}
/>
```

Add an `error?: boolean` prop.

**Step 4:** Commit after each component family (button, input, card, dialog, dropdown-menu) — five commits total here.

```bash
git add client/src/components/ui/button.tsx
git commit -m "refactor(ui): rebuild Button against design tokens"
# repeat per file group
```

---

## Task 6: Build the EmptyState component

**Files:**
- Create: `client/src/components/ui/empty-state.tsx`

**Step 1:** Implement per **§4.6**:

```tsx
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted/40 px-6 py-16 text-center", className)}>
      <Icon className="size-12 text-ink-subtle" aria-hidden />
      <h3 className="mt-4 text-h4 text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-small text-ink-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
```

**Step 2:** Commit.
```bash
git add client/src/components/ui/empty-state.tsx
git commit -m "feat(ui): add EmptyState component"
```

---

## Task 7: Build the dashboard shell — sidebar

**Files:**
- Modify: `client/src/components/dashboard/sidebar.tsx`
- Create: `client/src/components/dashboard/nav-items.ts`
- Create: `client/src/components/dashboard/sidebar-link.tsx`

**Step 1:** Define nav items. `client/src/components/dashboard/nav-items.ts`:

```ts
import {
  LayoutDashboard, FileText, FolderTree, MessageSquare,
  Calendar, CalendarPlus, Users, Inbox, Image, Heart,
  Quote, Settings, Building2
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: any;
  requires?: "staff" | "admin";
  group: "main" | "content" | "operations" | "cms" | "account";
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Overview",        href: "/dashboard",                       icon: LayoutDashboard, group: "main" },
  { label: "Publications",    href: "/dashboard/publications",          icon: FileText,        group: "content" },
  { label: "Categories",      href: "/dashboard/publication-categories",icon: FolderTree,      group: "content" },
  { label: "Comments",        href: "/dashboard/comments",              icon: MessageSquare,   group: "content" },
  { label: "Events",          href: "/dashboard/events",                icon: Calendar,        group: "content" },
  { label: "Event categories",href: "/dashboard/event-categories",      icon: CalendarPlus,    group: "content" },
  { label: "Help requests",   href: "/dashboard/help-requests",         icon: Inbox,           group: "operations", requires: "admin" },
  { label: "Users",           href: "/dashboard/users",                 icon: Users,           group: "operations", requires: "admin" },
  { label: "Gallery",         href: "/dashboard/gallery",               icon: Image,           group: "cms" },
  { label: "Sponsors",        href: "/dashboard/sponsors",              icon: Heart,           group: "cms" },
  { label: "Testimonials",    href: "/dashboard/testimonials",          icon: Quote,           group: "cms" },
  { label: "App data",        href: "/dashboard/app-data",              icon: Building2,       group: "cms", requires: "admin" },
  { label: "Profile",         href: "/dashboard/profile",               icon: Settings,        group: "account" },
];
```

**Step 2:** Rebuild `client/src/components/dashboard/sidebar.tsx`. The shell must:
- Be 240px wide expanded, 64px collapsed (icon-only).
- Persist collapse state in `localStorage` under `dashboard:sidebar:collapsed`.
- Show grouped sections with subtle uppercase labels (`text-micro text-ink-subtle uppercase tracking-wide`).
- Highlight active item via `usePathname()`.
- Filter items by `requires` against the user's role.
- Be fixed-positioned on `lg+`, drawer on mobile.

Reference structure (skeleton — fill in styling per design doc):

```tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NAV_ITEMS, type NavItem } from "./nav-items";
import Logo from "@/components/logo";
import { cn } from "@/lib/utils";
import type { User } from "@/@types/db";

const GROUP_LABELS: Record<NavItem["group"], string> = {
  main: "",
  content: "Content",
  operations: "Operations",
  cms: "Site",
  account: "Account",
};

export default function DashboardSidebar({ user }: { user: User | null }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setCollapsed(localStorage.getItem("dashboard:sidebar:collapsed") === "1");
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("dashboard:sidebar:collapsed", next ? "1" : "0");
  };

  const visible = NAV_ITEMS.filter(item => {
    if (item.requires === "admin") return user?.is_superuser;
    if (item.requires === "staff") return user?.is_staff;
    return true;
  });

  const byGroup = visible.reduce<Record<string, NavItem[]>>((acc, item) => {
    (acc[item.group] ||= []).push(item);
    return acc;
  }, {});

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-surface lg:flex",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        {!collapsed && <Logo />}
        <button
          onClick={toggle}
          className="ml-auto rounded p-1.5 text-ink-muted hover:bg-surface-muted"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {Object.entries(byGroup).map(([group, items]) => (
          <div key={group} className="mb-6 last:mb-0">
            {!collapsed && GROUP_LABELS[group as NavItem["group"]] && (
              <div className="mb-1 px-2 text-micro uppercase tracking-wide text-ink-subtle">
                {GROUP_LABELS[group as NavItem["group"]]}
              </div>
            )}
            <ul className="space-y-0.5">
              {items.map(item => {
                const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-small transition-colors",
                        active ? "bg-surface-muted text-ink" : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
```

**Step 3:** Commit.
```bash
git add client/src/components/dashboard/
git commit -m "feat(dashboard): Linear-style sidebar with role-filtered nav"
```

---

## Task 8: Build the dashboard topbar

**Files:**
- Modify: `client/src/components/dashboard/navbar.tsx`
- Create: `client/src/components/dashboard/theme-toggle.tsx`
- Create: `client/src/components/dashboard/user-menu.tsx`
- Create: `client/src/components/dashboard/breadcrumbs.tsx`

**Step 1:** Wire `next-themes` for dashboard scope. Modify `client/src/app/dashboard/layout.tsx`:

```tsx
import { ThemeProvider } from "next-themes";
import DashboardSidebar from "@/components/dashboard/sidebar";
import DashboardTopbar from "@/components/dashboard/navbar";
import { getUser } from "@/services/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { data: user } = await getUser();
  if (!user) redirect("/login?next=/dashboard");
  if (!user.is_staff) redirect("/forbidden");

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="dashboard-theme">
      <div className="dashboard min-h-screen bg-background text-ink">
        <DashboardSidebar user={user} />
        <DashboardTopbar user={user} />
        <main className="lg:pl-60 pt-14">
          <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  );
}
```

**Step 2:** Build the topbar. Sticky, 56px, contains breadcrumbs + ⌘K trigger + theme toggle + user menu. Mobile: hamburger opens sidebar drawer.

```tsx
"use client";
import { Search } from "lucide-react";
import Breadcrumbs from "./breadcrumbs";
import ThemeToggle from "./theme-toggle";
import UserMenu from "./user-menu";
import type { User } from "@/@types/db";

export default function DashboardTopbar({ user }: { user: User }) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-surface/80 backdrop-blur lg:left-60">
      <div className="flex flex-1 items-center gap-4 px-6">
        <Breadcrumbs />
        <button
          className="ml-auto inline-flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-small text-ink-muted hover:bg-surface-muted"
          /* command palette wire-up in Task 9 */
        >
          <Search className="size-3.5" />
          <span>Search…</span>
          <kbd className="ml-2 rounded bg-surface-muted px-1.5 py-0.5 text-micro">⌘K</kbd>
        </button>
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
```

**Step 3:** ThemeToggle uses `next-themes`:

```tsx
"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex size-9 items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
```

**Step 4:** UserMenu — dropdown with avatar, name, email, "Profile", "Log out". Use existing `dropdown-menu.tsx` primitive.

**Step 5:** Breadcrumbs — derive from pathname, last segment becomes plain text, earlier ones links.

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const LABELS: Record<string, string> = {
  dashboard: "Overview",
  publications: "Publications",
  "publication-categories": "Categories",
  comments: "Comments",
  events: "Events",
  "event-categories": "Event categories",
  "help-requests": "Help requests",
  users: "Users",
  gallery: "Gallery",
  sponsors: "Sponsors",
  testimonials: "Testimonials",
  "app-data": "App data",
  profile: "Profile",
  new: "New",
};

export default function Breadcrumbs() {
  const path = usePathname();
  const segments = path.split("/").filter(Boolean);
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-small text-ink-muted">
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const label = LABELS[seg] ?? seg;
        return (
          <span key={href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3" />}
            {isLast ? <span className="text-ink">{label}</span> : <Link href={href} className="hover:text-ink">{label}</Link>}
          </span>
        );
      })}
    </nav>
  );
}
```

**Step 6:** Commit.
```bash
git add client/src/app/dashboard/layout.tsx client/src/components/dashboard/
git commit -m "feat(dashboard): topbar, theme toggle, breadcrumbs, user menu"
```

---

## Task 9: Command palette (⌘K)

**Files:**
- Create: `client/src/components/dashboard/command-palette.tsx`
- Modify: `client/src/components/dashboard/navbar.tsx` (wire trigger)
- Modify: `client/src/app/dashboard/layout.tsx` (mount palette provider)

**Step 1:** Use `cmdk` (installed in Task 2). Provides global ⌘K listener, opens a centered dialog, lists nav items + (deferred) search results.

```tsx
"use client";
import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { NAV_ITEMS } from "./nav-items";
import type { User } from "@/@types/db";

const Ctx = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} });
export const useCommandPalette = () => useContext(Ctx);

export function CommandPaletteProvider({ user, children }: { user: User; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visible = NAV_ITEMS.filter(item => {
    if (item.requires === "admin") return user.is_superuser;
    if (item.requires === "staff") return user.is_staff;
    return true;
  });

  return (
    <Ctx.Provider value={{ open, setOpen }}>
      {children}
      <Command.Dialog open={open} onOpenChange={setOpen} label="Command palette" className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className="relative w-full max-w-lg overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          <Command.Input placeholder="Type a command or search…" className="w-full border-b border-border bg-transparent px-4 py-3 text-body outline-none placeholder:text-ink-subtle" />
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="px-3 py-8 text-center text-small text-ink-muted">No results.</Command.Empty>
            <Command.Group heading="Navigation" className="text-micro uppercase tracking-wide text-ink-subtle">
              {visible.map(item => (
                <Command.Item
                  key={item.href}
                  onSelect={() => { router.push(item.href); setOpen(false); }}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-small text-ink data-[selected=true]:bg-surface-muted"
                >
                  <item.icon className="size-4 text-ink-muted" />
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </div>
      </Command.Dialog>
    </Ctx.Provider>
  );
}
```

**Step 2:** Wrap dashboard layout: `<CommandPaletteProvider user={user}>` inside the `<ThemeProvider>`.

**Step 3:** In `navbar.tsx`, wire the search button: `onClick={() => setOpen(true)}` via the hook.

**Step 4:** Manual verification: press ⌘K (or Ctrl+K), navigate to any item, palette closes.

**Step 5:** Commit.
```bash
git add client/src/components/dashboard/command-palette.tsx client/src/components/dashboard/navbar.tsx client/src/app/dashboard/layout.tsx
git commit -m "feat(dashboard): cmdk-powered command palette (⌘K)"
```

---

## Task 10: Dashboard overview (home) page

**Files:**
- Modify: `client/src/app/dashboard/page.tsx`
- Create: `client/src/components/dashboard/stat-card.tsx`
- Create: `client/src/components/dashboard/recent-activity.tsx`

**Step 1:** StatCard primitive:

```tsx
import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number | string;
  delta?: { value: string; positive: boolean };
  href: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, delta, href, icon: Icon }: Props) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong"
    >
      <div className="flex items-center justify-between">
        <span className="text-micro uppercase tracking-wide text-ink-subtle">{label}</span>
        <Icon className="size-4 text-ink-subtle" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-h2 font-sans tabular-nums">{value}</span>
        {delta && (
          <span className={delta.positive ? "text-small text-success" : "text-small text-danger"}>{delta.value}</span>
        )}
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-small text-ink-muted opacity-0 transition-opacity group-hover:opacity-100">
        View all <ArrowUpRight className="size-3.5" />
      </span>
    </Link>
  );
}
```

**Step 2:** Wire overview page. Server component, fetches counts in parallel.

```tsx
import { Suspense } from "react";
import { FileText, Calendar, Inbox, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import RecentActivity from "@/components/dashboard/recent-activity";
import { getUser } from "@/services/server/auth";
import { getPublicationsStats } from "@/services/server/publications";
import { getEventsStats } from "@/services/server/events";
import { getHelpRequestsStats } from "@/services/server/help-requests";
import { getUsersStats } from "@/services/server/users";

export const metadata = { title: "Overview | ABU Law Clinic" };

export default async function DashboardOverviewPage() {
  const { data: user } = await getUser();
  const [pubs, events, helpReqs, users] = await Promise.all([
    getPublicationsStats(),
    getEventsStats(),
    user?.is_superuser ? getHelpRequestsStats() : Promise.resolve({ data: null }),
    user?.is_superuser ? getUsersStats() : Promise.resolve({ data: null }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h1">Welcome back, {user?.first_name ?? "there"}.</h1>
        <p className="mt-1 text-body text-ink-muted">Here's what's happening across the clinic today.</p>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Publications" value={pubs.data?.total ?? 0} href="/dashboard/publications" icon={FileText} />
        <StatCard label="Upcoming events" value={events.data?.upcoming ?? 0} href="/dashboard/events" icon={Calendar} />
        {user?.is_superuser && (
          <>
            <StatCard label="Help requests" value={helpReqs.data?.new ?? 0} href="/dashboard/help-requests" icon={Inbox} />
            <StatCard label="Users" value={users.data?.total ?? 0} href="/dashboard/users" icon={Users} />
          </>
        )}
      </section>
      <section>
        <h2 className="text-h3 mb-4">Recent activity</h2>
        <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-surface-muted" />}>
          <RecentActivity isAdmin={!!user?.is_superuser} />
        </Suspense>
      </section>
    </div>
  );
}
```

**Step 3:** Stub stats endpoints exist (verify `getPublicationsStats` etc. — if not, add them to `services/server/*` returning hardcoded `{ data: { total: 0 } }` so Wave 1 compiles. Real implementations come in Wave 2's backend section.)

**Step 4:** Commit.
```bash
git add client/src/app/dashboard/page.tsx client/src/components/dashboard/
git commit -m "feat(dashboard): overview page with stat cards + recent activity"
```

---

## Task 11: Backend permission classes

**Files:**
- Modify: `server/app/permissions.py`
- Create: `server/app/tests/test_permissions.py`

**Step 1 (failing test):** Create `server/app/tests/test_permissions.py`:

```python
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from app.permissions import IsStaffUser, IsAdminUser, ReadOnlyOrStaff

User = get_user_model()

@pytest.fixture
def factory(): return APIRequestFactory()

@pytest.fixture
def regular_user(db): return User.objects.create_user(email="r@example.com", password="x")

@pytest.fixture
def staff_user(db): return User.objects.create_user(email="s@example.com", password="x", is_staff=True)

@pytest.fixture
def admin_user(db): return User.objects.create_user(email="a@example.com", password="x", is_staff=True, is_superuser=True)

def test_is_staff_blocks_regular(factory, regular_user):
    req = factory.get("/x"); req.user = regular_user
    assert IsStaffUser().has_permission(req, None) is False

def test_is_staff_allows_staff(factory, staff_user):
    req = factory.get("/x"); req.user = staff_user
    assert IsStaffUser().has_permission(req, None) is True

def test_is_admin_blocks_staff(factory, staff_user):
    req = factory.get("/x"); req.user = staff_user
    assert IsAdminUser().has_permission(req, None) is False

def test_is_admin_allows_superuser(factory, admin_user):
    req = factory.get("/x"); req.user = admin_user
    assert IsAdminUser().has_permission(req, None) is True

def test_readonly_or_staff_allows_anon_get(factory):
    req = factory.get("/x"); req.user = None
    assert ReadOnlyOrStaff().has_permission(req, None) is True

def test_readonly_or_staff_blocks_anon_post(factory):
    from django.contrib.auth.models import AnonymousUser
    req = factory.post("/x"); req.user = AnonymousUser()
    assert ReadOnlyOrStaff().has_permission(req, None) is False
```

**Step 2:** Run, expect failure (classes likely missing).
```bash
cd server && python -m pytest app/tests/test_permissions.py -v
```

**Step 3:** Implement in `server/app/permissions.py` per **§6.4** of the design doc.

**Step 4:** Run tests again, expect pass.

**Step 5:** Commit.
```bash
git add server/app/permissions.py server/app/tests/test_permissions.py
git commit -m "feat(server): add IsStaffUser, IsAdminUser, ReadOnlyOrStaff permission classes"
```

---

## Task 12: Polish public pages — header, footer, home

**Files:**
- Modify: `client/src/components/site-header.tsx`
- Modify: `client/src/components/footer.tsx`
- Modify: `client/src/components/home/*` (every component)
- Modify: `client/src/components/mobile-nav.tsx`

**Step 1:** Site header — sticky, transparent over hero, solid on scroll. Single nav row.

Key rules:
- Logo on the left.
- 5 nav links centered: Home / About / Publications / Events / Get Help.
- "Login" or user avatar on the right.
- 64px tall (was probably bigger).
- Mobile: hamburger triggers `mobile-nav.tsx`.

Replace any `font-bold` headers with `font-serif font-semibold`. Replace `bg-white` / `bg-zinc-50` with `bg-surface` / `bg-surface-muted`.

**Step 2:** Footer — 4-column grid (Clinic / Resources / Contact / Legal), copyright in `text-micro text-ink-subtle`. ABU attribution discreet.

**Step 3:** Home (`components/home/index.tsx` and friends):
- Hero: full-bleed image (`/public/images/hero/*`), display-sized serif headline ("Justice begins with access"), subheadline in `text-body text-ink-muted`, two CTAs (primary "Get legal help" → `/get-help`, secondary "Learn about the clinic" → `/about`).
- Mission strip: three columns under hero — mission, vision, history excerpt — each with a small icon, serif title, body text.
- Featured events: grid of upcoming events cards (deferred details to Wave 2 polish, just style cards now).
- Testimonials: editorial pull-quote style, large serif italic, attribution underneath.
- Sponsors strip: greyscale logos in a row, opacity 60%, full opacity on hover.

Acceptance: visit `/` at 360, 768, 1280 — every section breathes, no horizontal scroll, type hierarchy obvious.

**Step 4:** Mobile nav — slide-in drawer from right, full-screen on small phones, large tap targets (48px min), serif headings, links 18px.

**Step 5:** Commit per section.
```bash
git add client/src/components/site-header.tsx client/src/components/mobile-nav.tsx
git commit -m "feat(public): refine site header + mobile nav"

git add client/src/components/footer.tsx
git commit -m "feat(public): refine footer to 4-column editorial layout"

git add client/src/components/home/
git commit -m "feat(public): redesign home with editorial hero + mission strip + testimonials"
```

---

## Task 13: Polish remaining public pages

**Files:**
- Modify: `client/src/app/about/page.tsx` + `client/src/components/about/*`
- Modify: `client/src/app/contact/page.tsx` (verify exists; create if not)
- Modify: `client/src/app/faq/page.tsx`
- Modify: `client/src/app/get-help/page.tsx` + `client/src/components/get-help/*`
- Modify: `client/src/app/excos/page.tsx` + `client/src/components/excos/*`
- Modify: `client/src/app/sponsors/page.tsx` + `client/src/components/sponsors/*`
- Modify: `client/src/app/publications/*`
- Create: `client/src/app/gallery/page.tsx` (surface the existing `gallery-showcase.tsx` component as a route)

**Step 1:** Apply token swap project-wide via grep:
```bash
grep -rE "bg-(white|zinc-[0-9]+|gray-[0-9]+|slate-[0-9]+)" client/src/app client/src/components
```
Replace with token classes per **§3.1** mapping table.

**Step 2:** For each page above, apply these passes in order:
1. Replace heading classes with `text-h1`/`text-h2`/`text-h3` + `font-serif`.
2. Replace body text with `text-body text-ink` and muted variants with `text-ink-muted`.
3. Section wrappers use `py-20 md:py-28` for vertical rhythm.
4. Cards use `rounded-xl border border-border bg-surface p-6`.
5. Buttons use the rebuilt `<Button>` from Task 5.

**Step 3:** `get-help/` form — this is high-stakes UX. Convert to a 3-step wizard:
- Step 1: Personal details (name, email, phone).
- Step 2: Legal issue (type dropdown, previous help y/n).
- Step 3: Description (textarea, character counter, submit).
- Progress indicator at top (3 dots, current filled).
- React Hook Form + Zod, one schema per step.
- On submit: POST to `/api/v1/help-requests/`, redirect to `/get-help/submitted` confirmation page.

**Step 4:** Commit per page.

---

## Task 14: Quality gate — run typecheck, lint, build

**Step 1:** From `client/`:
```bash
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```
All three must pass without errors. Warnings allowed.

**Step 2:** From `server/`:
```bash
python -m pytest
python manage.py check
python manage.py makemigrations --dry-run
```
Tests pass; system check clean; no unintended migrations.

**Step 3:** Manual browser sweep:
- `/`, `/about`, `/publications`, `/events`, `/get-help`, `/contact`, `/faq`, `/excos`, `/sponsors`, `/gallery` — each loads without console errors, looks elegant.
- `/dashboard` (as staff) — sidebar, topbar, ⌘K palette, overview stats all work.
- Theme toggle in dashboard flips correctly without flash of unstyled content.
- 360px width — no horizontal scroll anywhere.

**Step 4:** If anything fails, fix and recommit before merging.

---

## Task 15: Wave 1 merge

**Step 1:** Open PR from `wave-1-design-system` → `main`.

**Step 2:** PR body: link to the design north-star doc and Wave 1 plan. Include before/after screenshots of `/` and `/dashboard`.

**Step 3:** Merge. Tag `v0.1.0-elegance-wave-1`.

**Step 4:** Remove the worktree.
```bash
git worktree remove ../law_clinic-wave-1
```

---

## Acceptance criteria for Wave 1

- [ ] Middleware correctly gates `/dashboard/*` on `is_staff` and admin-only routes on `is_superuser`.
- [ ] `/forbidden` page renders for unauthorized access.
- [ ] All fonts replaced (Lexend/Geist/Poppins/Delius removed). Inter + Fraunces + JetBrains Mono active.
- [ ] OKLCH token system in `globals.css`. All hard-coded colors replaced.
- [ ] Button, Input, Card, Dialog, Dropdown, Select, Checkbox follow design doc §4.
- [ ] `<EmptyState>` component exists and is used on the dashboard overview when stats are zero.
- [ ] Dashboard has: sidebar (collapsible, role-filtered), topbar (breadcrumbs, ⌘K, theme toggle, user menu), overview page (stat cards + recent activity), command palette (⌘K opens, navigates).
- [ ] Dashboard dark mode flips correctly; public site unaffected.
- [ ] Public pages — home, about, contact, faq, get-help (3-step wizard), excos, sponsors, gallery, publications list — all visually consistent.
- [ ] Backend permission classes exist with passing tests.
- [ ] `pnpm run build` and `python -m pytest` both pass.
- [ ] Manual browser sweep at 360/768/1280px — no regressions.

**Next:** `2026-05-25-wave-2-content-and-operations.md`
