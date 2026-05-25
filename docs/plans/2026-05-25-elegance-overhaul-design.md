# ABU Law Clinic — Elegance Overhaul: Design North Star

> **For Claude:** This is the foundational design specification. All three wave plans reference this document. Read this first before executing any wave plan.

**Date:** 2026-05-25
**Status:** Approved (decisions locked through brainstorming session)
**Companion plans:**
- `2026-05-25-wave-1-design-system-and-shell.md`
- `2026-05-25-wave-2-content-and-operations.md`
- `2026-05-25-wave-3-cms-and-account.md`

---

## 1. What "elegance" means for this platform

A university law clinic exists to be trusted. Students with sensitive legal problems must feel they are entering a credible, careful institution. Sponsors must feel the same. Internal admins must feel the tool respects their time.

Elegance here is therefore not decorative — it is the visible signal of those properties. Concretely, we commit to:

1. **Two registers, one system.** The public face is *editorial* (serif, generous whitespace, long-form reading optimized). The dashboard is *Linear-style* (geometric sans, dense, fast, dark-mode native). Both share tokens, type scale, motion vocabulary, and a single component library — they differ only in font assignment, density, and surface treatment.
2. **Restrained color.** ABU green is the institutional anchor. Everything else is ink, parchment, and one accent. No gradients unless purposeful. No drop shadows used as decoration.
3. **Real hierarchy.** Type, weight, and whitespace do the work of hierarchy. Not borders, not boxes, not color.
4. **Motion as feedback, never as decoration.** Page transitions, hover states, and loading states are tuned to feel like the system responding — under 200ms, eased, never bouncy.
5. **Component consistency.** Every input, button, card, dialog, table row, empty state, and error state in the system follows the same rules. A user who learns one form has learned every form.

---

## 2. Locked decisions (from brainstorming session)

| # | Decision | Choice |
|---|---|---|
| 1 | Aesthetic direction | **Hybrid (D)** — editorial public site, Linear dashboard |
| 2 | Feature scope | **All 16 features**, delivered in **3 waves** |
| 3 | Brand palette | **ABU-aligned modern (B)**, dashboard-only dark mode |
| 4a | Image storage | **Cloudflare R2** via Next.js presigned URLs |
| 4b | Publication editor | **TipTap → sanitized HTML**, `content_format` field on `Publication` |
| 5 | Roles | **Two-tier (B)**: `is_staff` = Editor, `is_superuser` = Admin |

---

## 3. Design tokens

### 3.1 Color (light + dark)

Tokens live in `client/src/app/globals.css` as CSS custom properties consumed by Tailwind v4. We replace any existing values.

**Light (public + dashboard light mode):**

```css
:root {
  /* Brand */
  --brand-green-50:  oklch(0.97 0.02 145);
  --brand-green-100: oklch(0.93 0.05 145);
  --brand-green-500: oklch(0.50 0.13 145); /* primary actions */
  --brand-green-700: oklch(0.38 0.12 145); /* hover, emphasis */
  --brand-green-900: oklch(0.22 0.08 145); /* dark surfaces, ink-on-green */
  --brand-gold-500:  oklch(0.78 0.13 80);  /* accent only — never primary */

  /* Surfaces */
  --background:      oklch(0.99 0.005 90);  /* warm off-white parchment */
  --surface:         oklch(1.00 0 0);       /* pure white card */
  --surface-muted:   oklch(0.97 0.005 90);  /* subtle section bands */
  --border:          oklch(0.92 0.005 90);
  --border-strong:   oklch(0.85 0.005 90);

  /* Ink */
  --ink:             oklch(0.20 0.01 270);  /* primary text */
  --ink-muted:       oklch(0.45 0.01 270);  /* secondary text */
  --ink-subtle:      oklch(0.62 0.01 270);  /* tertiary / placeholder */

  /* Semantic */
  --success:         oklch(0.55 0.13 150);
  --warning:         oklch(0.72 0.14 75);
  --danger:          oklch(0.55 0.20 25);
  --info:            oklch(0.58 0.13 240);

  /* Mapping to shadcn tokens (keep names; swap values) */
  --primary:         var(--brand-green-700);
  --primary-foreground: oklch(0.99 0.005 90);
  --secondary:       var(--surface-muted);
  --secondary-foreground: var(--ink);
  --muted:           var(--surface-muted);
  --muted-foreground: var(--ink-muted);
  --accent:          var(--brand-gold-500);
  --accent-foreground: var(--ink);
  --destructive:     var(--danger);
  --destructive-foreground: oklch(0.99 0.005 90);
  --ring:            var(--brand-green-500);
  --radius:          0.5rem;
}
```

**Dark (dashboard only — `.dark` class on `<html>` inside `/dashboard/*`):**

```css
.dark {
  --background:      oklch(0.16 0.01 270);  /* near-black with hint of blue */
  --surface:         oklch(0.19 0.01 270);
  --surface-muted:   oklch(0.22 0.01 270);
  --border:          oklch(0.26 0.01 270);
  --border-strong:   oklch(0.32 0.01 270);

  --ink:             oklch(0.96 0.005 270);
  --ink-muted:       oklch(0.72 0.005 270);
  --ink-subtle:      oklch(0.55 0.005 270);

  --primary:         oklch(0.65 0.14 145); /* lighter green for dark */
  --primary-foreground: oklch(0.16 0.01 270);
  --accent:          oklch(0.80 0.13 80);
}
```

Rationale: OKLCH gives perceptually uniform lightness ramps and avoids the muddy mid-tones sRGB produces. Tailwind v4 supports it natively.

### 3.2 Typography

**Public (editorial):**
- Display + headings: **Fraunces** (serif, variable, optical sizing) — `next/font/google`
- Body prose: **Source Serif 4** or fall back to **Fraunces** at lighter weight — for publication articles only
- UI labels, navigation, buttons on public pages: **Inter** (sans, variable)

**Dashboard (Linear):**
- All text: **Inter** with `--font-feature-settings: 'cv11', 'ss01', 'ss03'` (gives the slightly humanist tweaks Linear uses)
- Monospace: **JetBrains Mono** for code blocks, IDs, timestamps

**Retire:** `Lexend`, `Geist`, `Geist_Mono`, `Poppins`, `Delius` from `layout.tsx` and `logo.tsx`. They were imported in `next/font/google` calls but used inconsistently.

**Type scale (modular, ratio 1.250 minor third for dashboard, 1.333 perfect fourth for public):**

| Token | Public size | Dashboard size | Weight | Line-height |
|---|---|---|---|---|
| `text-display` | 4.5rem (72px) | — | 600 | 1.05 |
| `text-h1` | 3rem (48px) | 1.875rem (30px) | 600 | 1.1 |
| `text-h2` | 2.25rem (36px) | 1.5rem (24px) | 600 | 1.2 |
| `text-h3` | 1.5rem (24px) | 1.25rem (20px) | 600 | 1.3 |
| `text-h4` | 1.25rem (20px) | 1.125rem (18px) | 500 | 1.4 |
| `text-body` | 1.0625rem (17px) | 0.9375rem (15px) | 400 | 1.65 (public), 1.5 (dash) |
| `text-small` | 0.9375rem (15px) | 0.8125rem (13px) | 400 | 1.5 |
| `text-micro` | 0.8125rem (13px) | 0.75rem (12px) | 500 | 1.4 |

Line-height for body on public pages is deliberately tall (1.65) because users are reading. Dashboard body is 1.5 — denser, scanning.

### 3.3 Spacing & layout

- Base unit: 4px (Tailwind default).
- Public max content width: **65ch** for prose, **1200px** for marketing layouts.
- Dashboard max content width: **1280px** for tables/lists, **800px** for forms.
- Section vertical rhythm on public pages: `py-20 md:py-28 lg:py-36` between major sections. Generous.
- Dashboard page padding: `px-6 py-6` (consistent, dense).

### 3.4 Radius, elevation, borders

- `--radius: 0.5rem` (8px) — applied to most components.
- Cards: 12px radius (`rounded-xl`) on public, 8px (`rounded-lg`) on dashboard.
- Buttons: 8px (`rounded-md`).
- **No box-shadows on public pages** except hovers and dialogs. Hierarchy is type, not shadow.
- Dashboard uses one shadow token: `--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.04)` for cards, `--shadow-md` for popovers/dropdowns.

### 3.5 Motion

- Default ease: `cubic-bezier(0.22, 1, 0.36, 1)` (a calm ease-out).
- Default duration: 180ms.
- Hover transitions: 120ms.
- Page transitions: 240ms.
- Dashboard sidebar collapse: 200ms.
- **No spring bounces. No infinite loops outside loaders.** Framer Motion is allowed but defaults to these tokens.

---

## 4. Component conventions

### 4.1 The "elegance contract"
Every interactive component MUST have all of these explicitly defined:

1. Default state
2. Hover state
3. Focus-visible state (keyboard) — visible ring using `--ring`
4. Active/pressed state
5. Disabled state
6. Loading state (where applicable)
7. Error state (for inputs)
8. Empty state (for lists, tables, cards)

Reviewers reject components that omit any of these.

### 4.2 Buttons

Three variants only: `primary`, `secondary`, `ghost`. Plus `destructive` for confirmation flows.

- Primary: solid `--primary`, white text, subtle inner highlight on hover, no shadow.
- Secondary: 1px border `--border-strong`, transparent bg, ink text.
- Ghost: no border, text only, bg tint on hover.
- Destructive: solid `--danger`, white text, only used inside confirm dialogs.

Sizes: `sm` (32px), `md` (40px — default), `lg` (48px). Buttons always have icons on the left, label on the right, 8px gap.

### 4.3 Inputs

- Height 40px (matches `md` button).
- 1px border `--border`, focus ring `--ring` 2px offset 2px.
- Label sits **above** the input, 8px gap. Never floating labels (they hurt scannability and a11y).
- Helper text below in `--ink-muted`, 13px.
- Error state: border `--danger`, message below in `--danger`.
- Required indicator: subtle asterisk in `--accent`.

### 4.4 Cards

- White (`--surface`) on parchment background.
- 12px radius on public, 8px on dashboard.
- Padding: 24px (public), 16-20px (dashboard).
- No shadow at rest on public. Subtle `--shadow-sm` on dashboard. Both lift on hover when interactive.

### 4.5 Tables (dashboard primary)

- Row height 44px (compact) or 56px (comfortable). Default compact.
- Header: 12px uppercase, `--ink-muted`, `tracking-wide`.
- Zebra striping disabled — use single hairline borders instead (1px `--border`).
- Sticky header on scroll.
- Right-click row → context menu (Linear pattern, deferred to Wave 2 polish if time).

### 4.6 Empty states

Every list/table page renders an explicit `<EmptyState>` component when results are zero. Components must have:

- An icon (Lucide, 48px, `--ink-subtle`)
- A headline (text-h4)
- One sentence of context
- A primary action button (if action is possible)

No bare "No data" text anywhere.

### 4.7 Loading states

- Page-level: skeleton screens that match the actual layout (not spinners).
- Inline (e.g., button submitting): spinner replaces label.
- Top of page: `nextjs-toploader` (already installed).
- Never block a page on a single request — stream sections in independently.

---

## 5. Information architecture

### 5.1 Public site routes (existing + polish)

```
/                       Home (hero, mission, featured events, sponsors strip, CTA)
/about                  Mission, vision, history, leadership (excos)
/excos                  Executive team grid
/publications           List + categories filter + search
/publications/[slug]    Article view
/events                 List + upcoming/past filter (NEW: list view doesn't exist)
/events/[slug]          Event detail + register CTA
/gallery                Gallery showcase (already exists as component, surface as page)
/sponsors               Sponsors grid
/faq                    FAQ accordion
/contact                Contact form
/get-help               Multi-step legal help intake form
/(auth)/login           Login
/(auth)/register        Register
/(auth)/verify-email    OTP entry
/(auth)/forgot-password Password reset request
/(auth)/reset-password  Password reset confirm
```

### 5.2 Dashboard routes (target state)

```
/dashboard                          Overview (stats + recent activity)
/dashboard/publications             List
/dashboard/publications/new         Create
/dashboard/publications/[id]        Edit
/dashboard/publication-categories   List + inline CRUD
/dashboard/comments                 Moderation queue [Admin only? No — Editor allowed]
/dashboard/events                   List
/dashboard/events/new               Create
/dashboard/events/[id]              Edit
/dashboard/events/[id]/registrations Registrants list + attendance
/dashboard/event-categories         List + inline CRUD
/dashboard/help-requests            Inbox [Admin only]
/dashboard/help-requests/[id]       Detail [Admin only]
/dashboard/users                    List [Admin only]
/dashboard/users/[id]               Detail [Admin only]
/dashboard/gallery                  List galleries
/dashboard/gallery/[id]             Gallery + images
/dashboard/sponsors                 List + CRUD
/dashboard/testimonials             List + CRUD
/dashboard/app-data                 Edit mission/vision/history [Admin only]
/dashboard/profile                  Own profile + settings
```

### 5.3 RBAC matrix

| Route | Anonymous | Authenticated | Editor (`is_staff`) | Admin (`is_superuser`) |
|---|---|---|---|---|
| All `/` public pages | ✅ | ✅ | ✅ | ✅ |
| `/get-help` submission | ✅ | ✅ | ✅ | ✅ |
| `/events/.../register` | ❌ → login | ✅ | ✅ | ✅ |
| `/dashboard/*` (most) | ❌ → login | ❌ → 403 | ✅ | ✅ |
| `/dashboard/help-requests/*` | ❌ | ❌ | ❌ → 403 | ✅ |
| `/dashboard/users/*` | ❌ | ❌ | ❌ → 403 | ✅ |
| `/dashboard/app-data` | ❌ | ❌ | ❌ → 403 | ✅ |

---

## 6. Architectural patterns to adopt project-wide

### 6.1 Data fetching

- **Server pages (RSC):** use `services/server/*.ts` exclusively. They authenticate via cookie-bound axios.
- **Client mutations + dependent queries:** use TanStack Query hooks living in `services/client/*.ts`. Query keys centralized in `services/client/query-keys.ts`.
- **Optimistic updates** for: comment approval, help-request status changes, gallery reordering, sponsor reordering, publication featured toggle.
- **`stale-while-revalidate` default**: `staleTime: 30_000`, `gcTime: 5 * 60_000`.

### 6.2 Forms

- `react-hook-form` + `zod` resolver everywhere. Existing deps.
- Schemas live next to forms in a sibling `.schema.ts` file.
- Submit handlers call client services that return `{ data, error }`. Surface `error.message` via `sonner` toast.
- Disable submit button while pending. Show inline field errors on blur and on submit attempt.

### 6.3 Error & loading boundaries

- Every dashboard route group gets `loading.tsx` (skeleton) and `error.tsx` (reset-able error card).
- Public pages get a single root-level `not-found.tsx` and `error.tsx`.
- 403 page: `client/src/app/(403)/forbidden/page.tsx` — friendly, links back to home.

### 6.4 Backend permission classes

Create `app/permissions.py` additions:

```python
class IsStaffUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser

class ReadOnlyOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_staff
```

Apply per viewset:

| ViewSet | Permission |
|---|---|
| `PublicationViewSet` | `ReadOnlyOrStaff` |
| `EventViewSet` | `ReadOnlyOrStaff` |
| `GalleryViewSet`, `SponsorViewSet`, `TestimonialViewSet` | `ReadOnlyOrStaff` |
| `HelpRequestViewSet` (write) | `AllowAny` for `create`, `IsAdminUser` for the rest |
| `UserViewSet` | `IsAdminUser` |
| `AppDataViewSet` | `ReadOnlyOrStaff` for read, `IsAdminUser` for write |
| `CommentViewSet` | `IsAuthenticatedOrReadOnly` for create, `IsStaffUser` for approve/delete |

### 6.5 Image upload pipeline (R2)

**Frontend:**
- `client/src/components/ui/image-uploader.tsx` — drop zone, accepts file, calls `/api/uploads/presign`, PUTs to R2 directly, returns final public URL via `onChange`.
- `client/src/lib/r2.ts` — pure helpers, no secrets.

**Next.js route handler:** `client/src/app/api/uploads/presign/route.ts`
- Authenticated via cookie JWT (verify with Django `/auth/user/` round-trip or decode the JWT locally).
- Requires `is_staff: true` for uploads to private/admin buckets; help-request attachments (if any added later) use a separate flow.
- Returns `{ uploadUrl, publicUrl, expiresInSeconds }`.
- Uses `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` with R2 endpoint.

**Env vars (Next.js):**
```
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=lawclinic-public
R2_PUBLIC_URL_BASE=https://cdn.lawclinic.example.com
```

**Bucket setup:** one public bucket `lawclinic-public` with a custom domain. Folder convention: `publications/{uuid}.{ext}`, `gallery/{gallery_id}/{uuid}.{ext}`, `avatars/{user_id}/{uuid}.{ext}`, `sponsors/{uuid}.{ext}`, `events/{event_id}/{uuid}.{ext}`.

### 6.6 TipTap editor

**Package:** `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `@tiptap/extension-typography`.

**Storage:**
- Publication model gains `content_format = models.CharField(max_length=10, choices=[('markdown','Markdown'),('html','HTML')], default='html')`.
- Existing rows get `'markdown'` via data migration.
- TipTap writes HTML; new posts default to `'html'`.

**Rendering on public `/publications/[slug]`:**
```tsx
if (publication.content_format === 'html') {
  return <SanitizedHtml html={publication.content} />
}
return <ReactMarkdown ...>{publication.content}</ReactMarkdown>
```

**Sanitization:** `isomorphic-dompurify` on the server (called inside the RSC), strip `<script>`, allow `<iframe>` only for `youtube.com|vimeo.com` srcs.

---

## 7. Out of scope (YAGNI)

The following were considered and **deliberately excluded** to keep waves shippable:

- Real-time WebSocket updates (events have `websockets` in requirements but no current use — leave alone)
- Celery async tasks (in requirements.txt but unused — don't activate; OTP email can stay synchronous for now)
- Public dark mode (only dashboard gets dark mode this round)
- Internationalization (English only)
- A search engine (Postgres ILIKE is enough for publication search)
- Comments on the public side beyond display (no comment submission UI in this round; moderation queue manages existing comments only — *update: include client-side comment submission as Wave 3 stretch if time allows*)
- Granular RBAC beyond two tiers
- Self-service password change without email verification
- Audit log
- File uploads to Django (R2 entirely)
- Migration of existing markdown publications to HTML (kept as `content_format='markdown'` forever)

---

## 8. Definition of done (any feature)

A feature ships only when **all** of these are true:

1. **Visual:** matches token system, all 8 component states defined, looks correct in Chrome + Safari + Firefox at 360px / 768px / 1280px / 1920px.
2. **Dark mode:** dashboard features work in both light and dark mode.
3. **Keyboard:** every interactive element reachable via Tab; Escape closes dialogs; focus rings visible.
4. **Loading:** skeleton or spinner shown for any operation >150ms.
5. **Error:** every fetch path has a recovery UI (retry button or clear message).
6. **Empty:** every list has an `<EmptyState>` for zero results.
7. **Backend:** correct permission class applied, tests pass, migrations idempotent.
8. **Frontend:** types match backend response shape (no `any`), no TypeScript errors, no ESLint errors.
9. **Acceptance:** the demo flow described in the wave plan is performed manually in a browser by the engineer and confirmed working.

---

## 9. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Existing Lexend/Poppins/Geist references break after font swap | High | Low | Wave 1 does a project-wide grep + sweep before merging |
| R2 presigning leaks credentials | Low | High | Keys live only in Next.js server env; route handler verifies `is_staff` from JWT before signing |
| TipTap output contains XSS | Medium | High | Sanitize on both save (via `tiptap-html-sanitize`) and render (DOMPurify) |
| Middleware bug (no `/dashboard` auth) is exploited | High | High | Wave 1 Task 1 — fix middleware before anything else |
| `content_format` migration breaks existing publication slugs | Low | Medium | Data migration is additive only; default `'markdown'` for existing rows |
| Sidebar collapse state lost on navigation | Medium | Low | Persist to `localStorage` |
| Help requests contain PII; admins screenshot/share | Out of scope | High | Train admins; future audit log work |

---

## 10. Handoff to wave plans

The three wave plans assume this document is read first. They reference its sections by number (e.g., "apply the button conventions from §4.2").

**Read next:** `2026-05-25-wave-1-design-system-and-shell.md`
