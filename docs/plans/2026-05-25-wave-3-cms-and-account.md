# Wave 3 — CMS, Account & Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **REQUIRED READING FIRST:** `2026-05-25-elegance-overhaul-design.md` (north-star), `2026-05-25-wave-1-design-system-and-shell.md`, `2026-05-25-wave-2-content-and-operations.md`.

**Goal:** Finish the dashboard. App data (mission/vision), gallery (with drag-reorder), sponsors, testimonials, comments moderation, profile/settings, full auth pages (register, verify-email, forgot/reset password), public site final polish, accessibility audit, and release.

**Architecture:** Same patterns as Wave 2 — viewset + permission + serializer on the backend if needed; `services/server/*` + `services/client/*` data layer; list + form + detail pages on the dashboard; public counterparts where appropriate. Drag-and-drop uses `@dnd-kit/sortable` (installed in Wave 1).

**Tech Stack:** @dnd-kit/sortable, react-hook-form + zod, Supabase JS client (for the existing auth/OTP flow — no new infra), Lucide.

**Out of scope:** Real-time updates, granular RBAC beyond two tiers, audit log, search engine, public dark mode.

---

## Task 0: Worktree

```bash
git worktree add ../law_clinic-wave-3 -b wave-3-cms-account
cd ../law_clinic-wave-3
```

---

## Task 1: AppData CMS

**Files:**
- Verify `server/app_settings/views.py` exposes an `AppDataViewSet` — if not, create it.
- Modify: permission to `IsAdminUser` for write, `AllowAny` for read.
- Create: `client/src/app/dashboard/app-data/page.tsx`
- Create: `client/src/components/dashboard/app-data/app-data-form.tsx`
- Create: `client/src/components/dashboard/app-data/app-data-form.schema.ts`
- Modify: `client/src/services/server/app_settings.ts` (add `getAppData`, `updateAppData`)
- Modify: `client/src/services/client/app_settings.ts` (create if missing)

**Step 1 (backend):** Ensure a singleton-style endpoint. Treat the first row as the canonical record. Either:
- Use a custom action `GET /api/v1/app_settings/app-data/current/` and `PUT /api/v1/app_settings/app-data/current/` that fetches/creates the first row, OR
- Standard `RetrieveUpdateAPIView` if there's exactly one well-known UUID.

**Recommended:**

```python
class AppDataViewSet(viewsets.ModelViewSet):
    queryset = AppData.objects.all()
    serializer_class = AppDataSerializer
    permission_classes = [ReadOnlyOrStaff]

    def get_permissions(self):
        if self.action in ("update", "partial_update", "create", "destroy"):
            return [IsAdminUser()]
        return [AllowAny()]

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def current(self, request):
        instance = AppData.objects.first()
        if not instance: return Response(None, status=204)
        return Response(self.get_serializer(instance).data)
```

**Step 2 (test):**

```python
def test_appdata_current_returns_first_row(db, client_anon):
    AppData.objects.create(name="ABU Law Clinic", mission_statement="m", vision_statement="v")
    res = client_anon.get("/api/v1/app_settings/app-data/current/")
    assert res.status_code == 200
    assert res.data["mission_statement"] == "m"
```

**Step 3 (dashboard form):** Single page, two-column. Fields: name, logo (ImageUploader `category="avatars"`), mission_statement (textarea, 500 chars), vision_statement (textarea, 500), history (textarea, 5000), objectives (textarea — Comma-separated per existing field comment).

**Step 4:** On the public `/about` page, fetch via `services/server/app_settings.getAppData()` and render mission/vision/history with serif headings.

**Step 5:** Commit.

---

## Task 2: Gallery

**Files:**
- Modify: `server/app_settings/views.py` (Gallery + GalleryImage viewsets with `ReadOnlyOrStaff`)
- Modify: `server/app_settings/serializers.py` (nested GalleryImage in Gallery)
- Create: `client/src/app/dashboard/gallery/page.tsx`
- Create: `client/src/app/dashboard/gallery/[id]/page.tsx`
- Create: `client/src/components/dashboard/gallery/gallery-form.tsx`
- Create: `client/src/components/dashboard/gallery/image-grid.tsx`
- Create: `client/src/components/dashboard/gallery/sortable-image.tsx`
- Modify: `client/src/app/gallery/page.tsx` (public surface)
- Modify: `client/src/services/server/app_settings.ts` + `services/client/app_settings.ts`

**Step 1 (backend):** Galleries CRUD; nested image creation endpoint:

```python
class GalleryImageViewSet(viewsets.ModelViewSet):
    serializer_class = GalleryImageSerializer
    permission_classes = [ReadOnlyOrStaff]
    filterset_fields = ["gallery"]
    queryset = GalleryImage.objects.all()

    @action(detail=False, methods=["post"], permission_classes=[IsStaffUser])
    def reorder(self, request):
        # body: { "order": [{ "id": "...", "ordering": 0 }, ...] }
        for item in request.data.get("order", []):
            GalleryImage.objects.filter(id=item["id"]).update(ordering=item["ordering"])
        return Response({"ok": True})
```

**Step 2:** Dashboard `/dashboard/gallery` list — table: title, department, year, is_previous, image count, actions. New gallery button.

**Step 3:** Dashboard `/dashboard/gallery/[id]` — gallery edit form (title, description, department select, year, is_previous, ordering) + image grid below.

**Step 4:** Image grid uses `@dnd-kit/sortable`. Each tile shows the image; drag-to-reorder writes to local state immediately, debounce-PUTs `reorder` endpoint after 500ms idle. Upload button at the end of the grid uses `ImageUploader category="gallery"`, on success creates a GalleryImage record via `POST /gallery-images/`. Per-tile actions: edit metadata (title, description, socials), delete (with confirm).

**Step 5:** Public `/gallery` page — surface the existing `gallery-showcase.tsx` component as a route. Filter chips for department + year. Lightbox view on click (use `vaul` drawer or a simple full-screen overlay).

**Step 6:** Commit per piece.

---

## Task 3: Sponsors

**Files:**
- Modify: `server/app_settings/views.py` (SponsorViewSet with `ReadOnlyOrStaff`, `reorder` action)
- Create: `client/src/app/dashboard/sponsors/page.tsx`
- Create: `client/src/components/dashboard/sponsors/sponsor-form.tsx`
- Modify: `client/src/app/sponsors/page.tsx` (public refresh)

**Step 1:** Sponsor form: name, type (person/organization), description (textarea), image (`ImageUploader category="sponsors"`), URL, ordering. Validate URL with zod.

**Step 2:** Dashboard list — sortable grid (same `@dnd-kit/sortable` pattern as gallery). Each card shows logo + name + type pill. Hover actions: edit, delete.

**Step 3:** Public `/sponsors` page editorial polish — two-section layout: organizations (large logos in greyscale, color on hover, in a grid), then individual benefactors (smaller cards with portrait + name + occupation).

**Step 4:** Commit.

---

## Task 4: Testimonials

**Files:**
- Modify: `server/app_settings/views.py` (TestimonialViewSet with `ReadOnlyOrStaff`)
- Create: `client/src/app/dashboard/testimonials/page.tsx`
- Create: `client/src/components/dashboard/testimonials/testimonial-form.tsx`
- Modify: home page `client/src/components/home/*` to show testimonials (already wired from Wave 1, just confirm)

**Step 1:** Form: name, occupation, quote (textarea, 500 chars), image (`ImageUploader category="avatars"`), category (free text — e.g., "Student", "Alumni", "Faculty").

**Step 2:** Dashboard list — simple table: name, occupation, category, quote preview (2-line clamp), actions.

**Step 3:** Home page treatment (already styled in Wave 1): editorial pull-quote, large serif italic, attribution below.

**Step 4:** Commit.

---

## Task 5: Comments moderation

**Files:**
- Modify: `server/publications/views.py` — add `CommentViewSet` with explicit permissions
- Modify: `server/publications/serializers.py` — `CommentSerializer`
- Modify: `server/publications/urls.py` — register comments route
- Create: `client/src/app/dashboard/comments/page.tsx`
- Create: `client/src/components/dashboard/comments/comment-moderation-card.tsx`
- Modify: `client/src/services/server/publications.ts` (`listComments`, `approveComment`, `deleteComment`)
- Modify: `client/src/services/client/publications.ts` (mutation hooks with optimistic update)

**Step 1 (backend):** CommentViewSet:

```python
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsStaffUser()]  # approve, delete

    @action(detail=True, methods=["post"], permission_classes=[IsStaffUser])
    def approve(self, request, pk=None):
        c = self.get_object()
        c.is_approved = True; c.save()
        return Response(self.get_serializer(c).data)
```

**Step 2 (test):** Anonymous can list approved comments; non-staff cannot approve; staff can.

**Step 3:** Moderation page:
- Tabs: Pending (default) / Approved / All.
- Each card: author avatar + name, publication title (link), comment body, posted_at relative, "Approve" + "Delete" buttons.
- Optimistic update: approve immediately removes from pending list and shows toast; rollback on failure.

**Step 4:** Public side — render approved comments under `/publications/[slug]`. Stretch: comment submission form for authenticated users. If time-constrained, comments are display-only in Wave 3; submission lives in a follow-up.

**Step 5:** Commit.

---

## Task 6: Profile / settings

**Files:**
- Create: `client/src/app/dashboard/profile/page.tsx`
- Create: `client/src/components/dashboard/profile/profile-form.tsx`
- Create: `client/src/components/dashboard/profile/password-change-form.tsx`
- Modify: `client/src/services/server/auth.ts` + `services/client/auth.ts` (add `updateOwnProfile`, `changePassword`)
- Verify backend supports password change. If not, add to `server/app/views.py`:

**Step 1:** Backend — own profile update is the existing `UpdateUserView` (`/auth/update-user/`). Password change endpoint:

```python
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        old, new = request.data.get("old_password"), request.data.get("new_password")
        if not user.check_password(old or ""):
            return Response({"detail": "Current password is incorrect."}, status=400)
        if len(new or "") < 8:
            return Response({"detail": "New password must be at least 8 characters."}, status=400)
        user.set_password(new); user.save()
        return Response({"ok": True})
```

Register at `path('auth/change-password/', ChangePasswordView.as_view(), name='change-password')`.

**Step 2 (test):** Wrong old password → 400. Short new password → 400. Correct → 200, password actually changes (`user.check_password(new)` is True).

**Step 3:** Profile page — two cards stacked:
- Card 1 (Profile): avatar (`ImageUploader category="avatars" id={user.id}`), first_name, last_name, phone, username (read-only), email (read-only). Save button.
- Card 2 (Security): old_password, new_password, confirm_new_password (zod refine equality). Save button.

**Step 4:** Commit.

---

## Task 7: Auth pages — register, verify-email, forgot/reset password

**Files:**
- Create: `client/src/app/(auth)/register/page.tsx`
- Create: `client/src/app/(auth)/verify-email/page.tsx`
- Create: `client/src/app/(auth)/forgot-password/page.tsx`
- Create: `client/src/app/(auth)/reset-password/page.tsx`
- Modify: `client/src/components/auth/*`
- Modify: `client/src/app/(auth)/layout.tsx`
- Verify backend: `server/app/views.py` `RegisterView`, `VerifyOTPView`, `ResendOTPView` already exist. Add `RequestPasswordResetView` + `ConfirmPasswordResetView`.

**Step 1:** Backend — password reset is missing. Add to `server/app/views.py`:

```python
class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        try:
            user = User.objects.get(email=email)
            user.generate_otp()  # reuse OTP infra
            # TODO: send email with OTP. For now log it.
            print(f"[password-reset] OTP for {email}: {user.otp}")
        except User.DoesNotExist:
            pass  # do not leak existence
        return Response({"ok": True})

class ConfirmPasswordResetView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        otp = request.data.get("otp", "")
        new = request.data.get("new_password", "")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid request."}, status=400)
        if not user.is_otp_valid(otp):
            return Response({"detail": "Invalid or expired OTP."}, status=400)
        if len(new) < 8:
            return Response({"detail": "New password must be at least 8 characters."}, status=400)
        user.set_password(new); user.otp = None; user.save()
        return Response({"ok": True})
```

Register URLs.

**Step 2:** Auth layout (`(auth)/layout.tsx`) — split-screen: left half image (`/public/images/hero/...`) with the wordmark overlaid in serif white; right half centered card with the form, max-width 400px. On mobile: image collapses to a 160px banner top.

**Step 3:** Register page — email, password, confirm_password, first_name, last_name, phone (optional), checkbox "I agree to the Privacy Notice". On submit: POST `/api/v1/auth/register/` → redirect to `/verify-email?email=<email>`.

**Step 4:** Verify-email page — 6-digit OTP input (use individual input boxes that auto-advance), email shown in muted text, "Resend code" link with 60s cooldown countdown. On verify: POST `/auth/verify-otp/`, on success redirect to `/login?verified=1`.

**Step 5:** Forgot-password — email input. On submit show "If an account exists with this email, we've sent a reset code." regardless. Link to `/reset-password?email=<email>`.

**Step 6:** Reset-password — OTP input + new_password + confirm. On success → `/login?reset=1`.

**Step 7:** Login polish — show banner if `?verified=1` or `?reset=1`. Add "Forgot password?" link.

**Step 8:** Commit per page.

---

## Task 8: Public side final polish

**Files:** any remaining pages not touched in Wave 1.

**Step 1:** Browser sweep at 360 / 768 / 1280 / 1920px for every public route. Note inconsistencies (font weights, spacing, broken images, missing alt text).

**Step 2:** Fix accumulated drift. Common targets:
- `/about` — surface `AppData` (mission, vision, history) from Wave 3 Task 1.
- `/excos` — grid of executives. If backend lacks an Excos model, this becomes hard-coded in `app_settings` `AppData.metadata` as a JSON field, or add a small `Exco` model. **Decision:** add `Exco` model now (name, role, image, bio, ordering) in `app_settings/models.py`. Migration. CRUD page at `/dashboard/excos`.
- `/faq` — content source: hard-coded in component is acceptable for v1, or add `Faq` model. **Decision:** hard-coded for v1 (YAGNI).
- `/contact` — form posts to a new `ContactMessage` model. **Decision:** OUT OF SCOPE for Wave 3 — link contact button to mailto + phone. Add `ContactMessage` in a future wave if real volume requires it.

**Step 2b (Excos):** Add `Exco` model:

```python
class Exco(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    image = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    ordering = models.PositiveIntegerField(default=0)
    is_current = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ["ordering", "name"]
```

Migrations + serializer + viewset (`ReadOnlyOrStaff`) + dashboard CRUD page following the sponsors pattern. Add nav entry. Public `/excos` reads from this.

**Step 3:** Commit polish per page or per area.

---

## Task 9: Accessibility audit

**Files:** all interactive components.

**Step 1:** Run an automated audit:
```bash
pnpm dlx @axe-core/cli http://localhost:3000 --exit
pnpm dlx @axe-core/cli http://localhost:3000/dashboard --exit
```

**Step 2:** Manual checklist for every page:
- Tab through every interactive element — focus ring visible, order logical.
- Escape closes every open dialog/drawer/dropdown.
- `aria-label` on every icon-only button.
- Form labels associated via `htmlFor` (use shadcn `<Label>` consistently).
- Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI components (verify in light + dark dashboard).
- No content lost when text scales to 200%.
- Images have meaningful `alt` (decorative get `alt=""`).
- Skip-to-content link on every layout.

**Step 3:** Fix issues. Common ones to expect:
- Theme toggle in dashboard needs `aria-pressed`.
- Avatar without name needs `alt`.
- TipTap editor needs an accessible name (`aria-label` on the `EditorContent` wrapper).

**Step 4:** Commit.

---

## Task 10: Final quality gate + release

**Step 1:**
```bash
cd client && pnpm exec tsc --noEmit && pnpm run lint && pnpm run build
cd ../server && python -m pytest && python manage.py check && python manage.py makemigrations --dry-run
```

**Step 2:** Manual end-to-end flow:
1. Visit `/`, scroll the whole page. Looks elegant in all viewports.
2. Submit help request via `/get-help`. Receive confirmation.
3. Register a new user; verify OTP; log in.
4. Log out, log in as admin.
5. Visit `/dashboard`. All stats real, recent activity populated.
6. Use ⌘K to navigate to publications. Create a new publication (TipTap + image). Publish.
7. View it on public `/publications/<slug>`.
8. Approve a comment in `/dashboard/comments`.
9. Manage gallery: create, reorder images by drag, delete.
10. Edit app data, see change reflected on `/about`.
11. Change own password via profile.
12. Use forgot-password flow with a different account.
13. Toggle dashboard dark mode; everything legible.
14. View dashboard on mobile (375px). Drawer works, tables scroll.

**Step 3:** Tag and merge:
```bash
gh pr create --title "Wave 3: CMS, Account & Polish" --body "..."
# Merge
git tag v1.0.0
git push --tags
git worktree remove ../law_clinic-wave-3
```

---

## Acceptance criteria for Wave 3

- [ ] AppData edit page works; `/about` reflects mission/vision/history.
- [ ] Gallery CRUD + drag-reorder works (debounced backend update); public `/gallery` shows it with filters.
- [ ] Sponsors CRUD + reorder works; public `/sponsors` has the two-tier editorial layout.
- [ ] Testimonials CRUD works; home page testimonial section pulls from DB.
- [ ] Comments moderation queue works with optimistic approve.
- [ ] Profile page: profile edit + password change both functional and tested.
- [ ] Register, verify-email (OTP auto-advance), forgot-password, reset-password all work.
- [ ] Auth layout has the split-screen editorial treatment.
- [ ] Excos page driven by new `Exco` model + dashboard CRUD.
- [ ] FAQ uses hard-coded content (v1 acceptable); `/contact` falls back to mailto.
- [ ] axe-core audit returns zero serious or critical violations on `/` and `/dashboard`.
- [ ] Keyboard nav works through every page.
- [ ] All quality gates pass; manual end-to-end completes without console errors.
- [ ] Tag `v1.0.0` published.

---

## After release

**Memory to capture** (for `~/.claude/projects/.../memory/`):
- That the law clinic uses two-tier RBAC: `is_staff` = Editor, `is_superuser` = Admin. New endpoints default to `ReadOnlyOrStaff` unless dealing with PII (help-requests, users, app-data) which require `IsAdminUser`.
- That all DB HTML rendering goes through `<SanitizedHtml>`. Server sanitizes with `bleach`; client with DOMPurify.
- That images are stored in R2 via presigned PUTs from `/api/uploads/presign`. Bucket prefix convention: `{category}/{id}/{uuid}.{ext}`.
- That publications have a `content_format` field — old rows are `'markdown'`, new rows are `'html'`. Renderer switches accordingly.

**Future work (out of scope for the elegance overhaul):**
- Public dark mode.
- Real-time comment notifications via websockets (already in requirements.txt).
- Celery async email + scheduled tasks.
- Granular RBAC if the team grows.
- Full-text search via Postgres `tsvector` or an external service.
- Audit log for sensitive actions (role changes, help-request access).
- Public-side comment submission.
- A `ContactMessage` model + inbox if `/contact` mailto isn't sufficient.
