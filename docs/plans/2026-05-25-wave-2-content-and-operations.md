# Wave 2 — Content & Operations Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **REQUIRED READING FIRST:** `2026-05-25-elegance-overhaul-design.md` (north-star) and `2026-05-25-wave-1-design-system-and-shell.md` (Wave 1).

## Security note (read before implementing)

This wave introduces a rich text editor (TipTap) that produces HTML stored in the database. **Every HTML render path in this plan is sanitized at two layers — server-side via `bleach` on save, and client-side via DOMPurify on render.** No untrusted HTML is rendered without going through `SanitizedHtml`. Direct use of React's raw HTML injection prop is confined to that single component, and it always receives DOMPurify output. Reviewers must reject any PR that renders HTML from the database outside `SanitizedHtml`.

**Goal:** Build the high-traffic admin features. Publications (TipTap + R2), Events (with registrations), Help Requests inbox, Users management. Plus stats endpoints so Wave 1's overview shows real numbers.

**Architecture:** Each feature has (a) backend serializer/viewset/permission update if needed, (b) `services/server/*` + `services/client/*` data layer, (c) list page + form page on the dashboard, (d) public-side counterpart polish. TipTap stores HTML; sanitized on save (bleach) and on render (DOMPurify). Image uploads use the R2 presigned-URL pipeline introduced here.

**Tech Stack:** TipTap 2, isomorphic-dompurify, bleach, @aws-sdk/client-s3, @dnd-kit, TanStack Query mutations with optimistic updates.

**Out of scope for Wave 2:** App data CMS, gallery, sponsors, testimonials, comments moderation UI, profile page, auth page polish. Those live in Wave 3.

---

## Task 0: Worktree

```bash
git worktree add ../law_clinic-wave-2 -b wave-2-content-ops
cd ../law_clinic-wave-2
```

---

## Task 1: Backend — stats endpoints

**Files:**
- Modify: `server/app/views.py` (`UserViewSet.overview`, `HelpRequestViewSet.statistics`)
- Modify: `server/publications/views.py` (`PublicationViewSet.stats`)
- Modify: `server/events/views.py` (`EventViewSet.stats`)
- Create: `server/publications/tests/test_stats.py`
- Create: `server/events/tests/test_stats.py`

**Step 1 (failing test):** `server/publications/tests/test_stats.py`:

```python
import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from publications.models import Publication

User = get_user_model()

@pytest.fixture
def admin(db):
    return User.objects.create_user(email="a@x.com", password="x", is_staff=True, is_superuser=True)

@pytest.fixture
def client(admin):
    c = APIClient(); c.force_authenticate(admin); return c

def test_publications_stats_counts(db, client, admin):
    Publication.objects.create(title="A", author=admin, content="x", status="published")
    Publication.objects.create(title="B", author=admin, content="x", status="draft")
    res = client.get("/api/v1/publications/publications/stats/")
    assert res.status_code == 200
    assert res.data["total"] == 2
    assert res.data["published"] == 1
    assert res.data["draft"] == 1
```

**Step 2:** Run, expect 404.

**Step 3:** Implement `stats` action:

```python
from rest_framework.decorators import action
from rest_framework.response import Response

class PublicationViewSet(...):
    @action(detail=False, methods=["get"], permission_classes=[IsStaffUser])
    def stats(self, request):
        qs = Publication.objects.all()
        return Response({
            "total": qs.count(),
            "published": qs.filter(status="published").count(),
            "draft": qs.filter(status="draft").count(),
            "archived": qs.filter(status="archived").count(),
            "featured": qs.filter(is_featured=True).count(),
        })
```

**Step 4:** Run tests, pass. Repeat same shape for Events (`upcoming`, `ongoing`, `completed`, `total`), HelpRequests (`new`, `in_review`, `resolved` — see Task 8 for status field), Users (`total`, `active`, `staff`).

**Step 5:** Commit per app:
```bash
git add server/publications/views.py server/publications/tests/
git commit -m "feat(server): /publications/stats endpoint"
```

---

## Task 2: R2 presigned-URL route handler

**Files:**
- Create: `client/src/app/api/uploads/presign/route.ts`
- Create: `client/src/lib/r2.ts`
- Create: `client/src/lib/r2.test.ts`
- Modify: `client/.env.local.example` (or create)

**Step 1:** Env vars from north-star §6.5 added to `.env.local.example`.

**Step 2 (failing test):** `client/src/lib/r2.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildObjectKey, sanitizeFilename } from "./r2";

describe("buildObjectKey", () => {
  it("prefixes by category", () => {
    expect(buildObjectKey({ category: "publications", filename: "img.png", id: "abc" })).toMatch(/^publications\/abc\/[a-f0-9-]+\.png$/);
  });
  it("rejects dangerous extensions", () => {
    expect(() => buildObjectKey({ category: "publications", filename: "evil.exe", id: "x" })).toThrow();
  });
});

describe("sanitizeFilename", () => {
  it("removes path traversal", () => {
    expect(sanitizeFilename("../../etc/passwd.png")).toBe("etcpasswd.png");
  });
});
```

(If `vitest` isn't set up: `pnpm add -D vitest @vitest/coverage-v8` and add `"test": "vitest run"` to `package.json` scripts.)

**Step 3:** Run, expect fail.

**Step 4:** Implement `client/src/lib/r2.ts`:

```ts
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_EXT = new Set(["png", "jpg", "jpeg", "webp", "gif", "svg"]);
type Category = "publications" | "gallery" | "avatars" | "sponsors" | "events";

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.]/g, "");
}

export function buildObjectKey({ category, filename, id }: { category: Category; filename: string; id: string }): string {
  const safe = sanitizeFilename(filename);
  const ext = safe.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXT.has(ext)) throw new Error(`Disallowed extension: ${ext}`);
  return `${category}/${id}/${randomUUID()}.${ext}`;
}

export function r2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function presignPut(key: string, contentType: string, expiresIn = 600): Promise<string> {
  const client = r2Client();
  const cmd = new PutObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key, ContentType: contentType });
  return getSignedUrl(client, cmd, { expiresIn });
}

export function publicUrl(key: string): string {
  return `${process.env.R2_PUBLIC_URL_BASE}/${key}`;
}
```

**Step 5:** Tests pass.

**Step 6:** Route handler `client/src/app/api/uploads/presign/route.ts`:

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildObjectKey, presignPut, publicUrl } from "@/lib/r2";
import { getUser } from "@/services/server/auth";

const Schema = z.object({
  category: z.enum(["publications", "gallery", "avatars", "sponsors", "events"]),
  filename: z.string().min(1).max(255),
  contentType: z.string().regex(/^image\//),
  id: z.string().min(1).max(64),
});

export async function POST(req: Request) {
  const { data: user } = await getUser();
  if (!user?.is_staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const key = buildObjectKey(parsed.data);
    const uploadUrl = await presignPut(key, parsed.data.contentType);
    return NextResponse.json({ uploadUrl, publicUrl: publicUrl(key), expiresInSeconds: 600 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
```

**Step 7:** Commit.

---

## Task 3: ImageUploader component

**Files:**
- Create: `client/src/components/ui/image-uploader.tsx`
- Create: `client/src/lib/uploads.ts`

**Step 1:** `client/src/lib/uploads.ts`:

```ts
type UploadArgs = {
  file: File;
  category: "publications" | "gallery" | "avatars" | "sponsors" | "events";
  id: string;
  onProgress?: (pct: number) => void;
};

export async function uploadImage({ file, category, id, onProgress }: UploadArgs): Promise<string> {
  const presignRes = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, filename: file.name, contentType: file.type, id }),
  });
  if (!presignRes.ok) throw new Error("Failed to obtain upload URL");
  const { uploadUrl, publicUrl } = await presignRes.json();

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`));
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(file);
  });

  return publicUrl;
}
```

**Step 2:** `client/src/components/ui/image-uploader.tsx`:

```tsx
"use client";
import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { uploadImage } from "@/lib/uploads";
import { cn } from "@/lib/utils";

interface Props {
  value?: string | null;
  onChange: (url: string | null) => void;
  category: "publications" | "gallery" | "avatars" | "sponsors" | "events";
  id: string;
  className?: string;
  label?: string;
}

export function ImageUploader({ value, onChange, category, id, className, label = "Upload image" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null); setUploading(true); setProgress(0);
    try {
      const url = await uploadImage({ file, category, id, onProgress: setProgress });
      onChange(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="" className="h-32 w-32 rounded-lg border border-border object-cover" />
          <button onClick={() => onChange(null)} type="button" aria-label="Remove image" className="absolute -right-2 -top-2 rounded-full bg-surface p-1 text-ink shadow-sm">
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface-muted/40 px-4 text-small text-ink-muted transition-colors hover:border-border-strong hover:bg-surface-muted"
        >
          <UploadCloud className="size-5" />
          <span>{uploading ? `Uploading… ${progress}%` : label}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {error && <p className="mt-2 text-small text-danger">{error}</p>}
    </div>
  );
}
```

**Step 3:** Commit.

---

## Task 4: Publications — model migration + TipTap editor + sanitization

**Files:**
- Modify: `server/publications/models.py` (add `content_format`)
- Create: `server/publications/migrations/000X_add_content_format.py` (via `makemigrations`)
- Modify: `server/publications/serializers.py` (expose `content_format`, sanitize on save)
- Modify: `server/requirements.txt` (add `bleach`)
- Create: `client/src/components/dashboard/publications/tiptap-editor.tsx`
- Create: `client/src/components/dashboard/publications/publication-form.tsx`
- Create: `client/src/components/dashboard/publications/publication-form.schema.ts`
- Modify: `client/src/app/dashboard/publications/page.tsx`
- Create: `client/src/app/dashboard/publications/new/page.tsx`
- Create: `client/src/app/dashboard/publications/[id]/page.tsx`

**Step 1:** Add to `server/publications/models.py`:

```python
class Publication(models.Model):
    CONTENT_FORMAT_CHOICES = (("markdown", "Markdown"), ("html", "HTML"))
    content_format = models.CharField(max_length=10, choices=CONTENT_FORMAT_CHOICES, default="html")
```

`pip install bleach` and add `bleach==6.1.0` to `requirements.txt`.

```bash
cd server && python manage.py makemigrations publications
```

**Step 2:** Edit generated migration to backfill existing rows:

```python
def backfill_format(apps, schema_editor):
    Publication = apps.get_model("publications", "Publication")
    Publication.objects.all().update(content_format="markdown")

operations = [
    migrations.AddField(
        model_name="publication",
        name="content_format",
        field=models.CharField(choices=[("markdown","Markdown"),("html","HTML")], default="html", max_length=10),
    ),
    migrations.RunPython(backfill_format, reverse_code=migrations.RunPython.noop),
]
```

```bash
python manage.py migrate
```

**Step 3:** Sanitize on the serializer (defense-in-depth):

```python
import bleach

ALLOWED_TAGS = ["p","br","strong","em","u","a","ul","ol","li","blockquote","h2","h3","h4","pre","code","img","figure","figcaption","table","thead","tbody","tr","th","td","hr"]
ALLOWED_ATTRS = {"a":["href","title","rel","target"], "img":["src","alt","title"]}

class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = "__all__"  # include content_format
    def validate(self, attrs):
        if attrs.get("content_format") == "html" and attrs.get("content"):
            attrs["content"] = bleach.clean(attrs["content"], tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS, strip=True)
        return attrs
```

**Step 4 (test):** `server/publications/tests/test_sanitize.py`:

```python
def test_publication_sanitizes_script_on_save(db, admin_user):
    from publications.serializers import PublicationSerializer
    s = PublicationSerializer(data={
        "title": "X", "author": str(admin_user.id), "content_format": "html",
        "content": "<p>Hi</p><script>alert(1)</script>",
    })
    assert s.is_valid(), s.errors
    obj = s.save()
    assert "<script>" not in obj.content
    assert "<p>Hi</p>" in obj.content

def test_new_publication_defaults_to_html(db, admin_user):
    p = Publication.objects.create(title="X", author=admin_user, content="<p>hi</p>")
    assert p.content_format == "html"
```

Run, pass. Commit backend.

**Step 5:** TipTap editor `client/src/components/dashboard/publications/tiptap-editor.tsx`:

```tsx
"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Code, Link2, ImageIcon, Undo, Redo } from "lucide-react";
import { uploadImage } from "@/lib/uploads";
import { useRef } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  publicationId: string;
  placeholder?: string;
}

export function TiptapEditor({ value, onChange, publicationId, placeholder }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: "rounded-lg my-4" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "underline" } }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
      Typography,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: "prose-editorial max-w-none focus:outline-none min-h-[400px] p-4" } },
  });

  if (!editor) return null;

  const insertImage = async (file: File) => {
    const url = await uploadImage({ file, category: "publications", id: publicationId });
    editor.chain().focus().setImage({ src: url }).run();
  };

  const Btn = ({ icon: Icon, action, active, label }: any) => (
    <button type="button" onClick={action} aria-pressed={active} aria-label={label}
      className={`rounded-md p-1.5 text-ink-muted hover:bg-surface-muted ${active ? "bg-surface-muted text-ink" : ""}`}>
      <Icon className="size-4" />
    </button>
  );

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5">
        <Btn icon={Undo} action={() => editor.chain().focus().undo().run()} label="Undo" />
        <Btn icon={Redo} action={() => editor.chain().focus().redo().run()} label="Redo" />
        <div className="mx-1 h-5 w-px bg-border" />
        <Btn icon={Heading2} action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} label="Heading 2" />
        <Btn icon={Heading3} action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} label="Heading 3" />
        <Btn icon={Bold} action={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Bold" />
        <Btn icon={Italic} action={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Italic" />
        <Btn icon={Quote} action={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="Quote" />
        <Btn icon={Code} action={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} label="Inline code" />
        <Btn icon={List} action={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Bullet list" />
        <Btn icon={ListOrdered} action={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Numbered list" />
        <Btn icon={Link2} action={() => { const url = window.prompt("URL"); if (url) editor.chain().focus().setLink({ href: url }).run(); }} active={editor.isActive("link")} label="Link" />
        <Btn icon={ImageIcon} action={() => fileRef.current?.click()} label="Image" />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && insertImage(e.target.files[0])} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
```

**Step 6:** Form schema `publication-form.schema.ts`:

```ts
import { z } from "zod";
export const publicationSchema = z.object({
  title: z.string().min(3).max(255),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(20),
  content_format: z.enum(["markdown", "html"]).default("html"),
  featured_image: z.string().url().optional().nullable(),
  categories: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  is_featured: z.boolean().default(false),
  allow_comments: z.boolean().default(true),
  meta_title: z.string().max(100).optional(),
  meta_description: z.string().max(300).optional(),
  keywords: z.string().max(255).optional(),
});
export type PublicationFormValues = z.infer<typeof publicationSchema>;
```

**Step 7:** Form (`publication-form.tsx`) — two-column: main column (title, slug, excerpt, TipTap content); sidebar (status, featured toggle, allow comments, featured image uploader, categories multi-select, SEO accordion). Submit calls `createPublication` or `updatePublication` from `services/client/publications.ts`. On success: toast + `router.push("/dashboard/publications")`.

**Step 8:** List page — table:
- Columns: Title (with status badge), Author, Category, Updated, [actions menu].
- Filters: status dropdown, category dropdown, search input.
- Right side: "New publication" button.
- Row actions: View on site, Edit, Duplicate, Archive, Delete.
- `<EmptyState>` when zero.

**Step 9:** Commit per substantial piece (editor, form, list, sanitization tests).

---

## Task 5: Public publications pages refresh

**Files:**
- Modify: `client/src/app/publications/page.tsx`
- Modify: `client/src/app/publications/[slug]/page.tsx`
- Create: `client/src/components/publications/sanitized-html.tsx`

**Step 1:** `sanitized-html.tsx` — the **only** place in the codebase that renders DB HTML. Sanitization happens immediately before render.

```tsx
import DOMPurify from "isomorphic-dompurify";

const PURIFY_CONFIG = {
  ALLOWED_TAGS: ["p","br","strong","em","u","a","ul","ol","li","blockquote","h2","h3","h4","pre","code","img","figure","figcaption","table","thead","tbody","tr","th","td","hr"],
  ALLOWED_ATTR: ["href","title","rel","target","src","alt","class"],
  ALLOWED_URI_REGEXP: /^(https?:\/\/|\/|#)/i,
};

export function SanitizedHtml({ html, className }: { html: string; className?: string }) {
  // Sanitize first, then render. The output of DOMPurify is the contract we trust.
  const clean = DOMPurify.sanitize(html ?? "", PURIFY_CONFIG);
  // eslint-disable-next-line react/no-danger -- intentional: clean is DOMPurify output
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

**Step 2:** Detail page renderer switch:

```tsx
import { SanitizedHtml } from "@/components/publications/sanitized-html";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// inside the page:
{publication.content_format === "html"
  ? <SanitizedHtml html={publication.content} className="prose-editorial" />
  : <div className="prose-editorial"><ReactMarkdown remarkPlugins={[remarkGfm]}>{publication.content}</ReactMarkdown></div>}
```

**Step 3:** List page editorial polish:
- Two-column above 1024px: featured large card (latest featured publication), grid of smaller cards.
- Each card: thumbnail (16:9), category pill, serif title (text-h3), excerpt 2-line clamp, author + date in `text-micro text-ink-muted`.
- Categories filter as a chip row above the grid.
- Search input (live filter).
- Pagination matching existing backend behaviour.

**Step 4:** Detail page editorial polish:
- Header: category pill, h1 title in display serif, byline (author + date + mins_read), featured image full-bleed on desktop.
- Body: max-w-65ch centered, `prose-editorial` class.
- Footer: tags, share buttons (X, copy link), "Related publications" 3-card row.
- Comments display deferred to Wave 3.

**Step 5:** Commit.

---

## Task 6: Events — backend + dashboard

**Files:**
- Modify: `server/events/serializers.py` (expose `is_upcoming`, `registration_count`)
- Modify: `server/events/views.py` (apply `ReadOnlyOrStaff`, add `stats`, `register`, `cancel_registration` actions)
- Create: `client/src/components/dashboard/events/event-form.tsx`
- Create: `client/src/components/dashboard/events/event-form.schema.ts`
- Create: `client/src/app/dashboard/events/page.tsx`
- Create: `client/src/app/dashboard/events/new/page.tsx`
- Create: `client/src/app/dashboard/events/[id]/page.tsx`
- Create: `client/src/app/dashboard/events/[id]/registrations/page.tsx`
- Create: `client/src/app/dashboard/event-categories/page.tsx`
- Modify: `client/src/services/server/events.ts` + `client/src/services/client/events.ts`

**Step 1:** Backend permission swap + register/cancel actions:

```python
@action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
def register(self, request, pk=None):
    event = self.get_object()
    if event.has_registration_closed:
        return Response({"detail": "Registration is closed."}, status=400)
    reg, created = EventRegistration.objects.get_or_create(event=event, user=request.user)
    return Response({"registered": True, "created": created})

@action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
def cancel_registration(self, request, pk=None):
    EventRegistration.objects.filter(event_id=pk, user=request.user).delete()
    return Response({"registered": False})
```

Tests for both actions (TDD).

**Step 2:** Event form — Title; slug (auto from title, editable); Description (plain textarea + markdown preview tab — not full TipTap); Short description (140 char limit); Start/End datetime-local (end > start validator); Location + virtual link; Category select; Image (`ImageUploader category="events"`); Max participants (0 = unlimited); Registration required toggle + deadline (conditional); Status select; Featured toggle.

**Step 3:** Events list — table similar to publications. Filters: status, upcoming/past, category.

**Step 4:** Registrations page (`/dashboard/events/[id]/registrations`): header (title, dates, count/max); table (name, email, registered_at, attended toggle); CSV export button (client-side from loaded rows).

**Step 5:** Event categories — list with inline create/edit/delete.

**Step 6:** Commit per major piece.

---

## Task 7: Events — public side

**Files:**
- Create: `client/src/app/events/page.tsx`
- Create: `client/src/app/events/[slug]/page.tsx`
- Create: `client/src/components/events/*`

**Step 1:** `/events` list — tabs (Upcoming / Past). Cards: image, date pill (large day + short month above year), category, serif title, location, registration CTA if upcoming + not closed.

**Step 2:** `/events/[slug]` detail:
- Hero: cover image + title + key meta.
- Description body — events use markdown (textarea + ReactMarkdown), no TipTap, so render with `<ReactMarkdown>`.
- Sticky sidebar registration card:
  - `registration_required && !has_registration_closed && user`: "Register" button → POST register endpoint.
  - Already registered: green check + "You're registered" + "Cancel" link.
  - Closed: "Registration closed."
  - Anonymous: "Log in to register" link.
- Related events row below.

**Step 3:** Commit.

---

## Task 8: Help requests inbox

**Files:**
- Modify: `server/app/models.py` (add `status`, `assigned_to`, `internal_notes` to `HelpRequest`)
- Modify: `server/app/serializers.py`
- Modify: `server/app/views.py` (permission split: `AllowAny` for create, `IsAdminUser` else)
- Create: migration
- Create: `client/src/app/dashboard/help-requests/page.tsx`
- Create: `client/src/app/dashboard/help-requests/[id]/page.tsx`
- Modify: `client/src/services/server/help-requests.ts`
- Modify: `client/src/services/client/help-requests.ts`

**Step 1:** Model additions:

```python
STATUS_CHOICES = (
    ("new", "New"),
    ("in_review", "In review"),
    ("assigned", "Assigned"),
    ("resolved", "Resolved"),
    ("closed", "Closed"),
)
status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
assigned_to = models.ForeignKey("User", on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_help_requests")
internal_notes = models.TextField(blank=True, null=True)
```

Migration + apply. Test that new instances default to `"new"`.

**Step 2:** Permission split:

```python
def get_permissions(self):
    if self.action == "create":
        return [AllowAny()]
    return [IsAdminUser()]
```

**Step 3:** Inbox UI:
- Top banner: "These requests contain personal legal information. Handle with discretion."
- Filter tabs: All / New / In review / Assigned / Resolved (counts beside each).
- Two-pane: left list (cards with name, legal_issue_type, excerpt, relative time, status pill); right detail panel populated by `?selected=<id>` query param.
- Detail panel: full record, status changer (Select), assign-to picker (Combobox of staff users), internal notes textarea (autosave on blur), "Mark resolved" primary button.

**Step 4:** Commit per piece.

---

## Task 9: Users management polish

**Files:**
- Modify: `client/src/app/dashboard/users/page.tsx`
- Modify: `client/src/app/dashboard/users/[id]/page.tsx`
- Verify: `server/app/views.py` `UserViewSet` permissions = `[IsAdminUser]`

**Step 1:** List — table: avatar, name, email, role badge (Member / Editor / Admin), status pill (Active / Inactive), date joined, last login, actions menu.

**Step 2:** Filters: role, status, search by name/email.

**Step 3:** Detail page: profile card on left (avatar via `ImageUploader category="avatars"`, name, email, phone, dates); edit form on right (first_name, last_name, phone, is_active, is_staff, is_superuser).

**Step 4:** Role change confirmation: when toggling `is_superuser`, show confirm dialog with implications.

**Step 5:** Commit.

---

## Task 10: Query keys sweep

**Files:** `client/src/services/client/query-keys.ts`

```ts
export const QK = {
  publications: { all: ["publications"] as const, list: (params: any) => ["publications", "list", params] as const, detail: (id: string) => ["publications", "detail", id] as const, stats: ["publications", "stats"] as const },
  events: { all: ["events"] as const, list: (params: any) => ["events", "list", params] as const, detail: (id: string) => ["events", "detail", id] as const, registrations: (id: string) => ["events", "registrations", id] as const, stats: ["events", "stats"] as const },
  helpRequests: { all: ["help-requests"] as const, list: (params: any) => ["help-requests", "list", params] as const, detail: (id: string) => ["help-requests", "detail", id] as const, stats: ["help-requests", "stats"] as const },
  users: { all: ["users"] as const, list: (params: any) => ["users", "list", params] as const, detail: (id: string) => ["users", "detail", id] as const, stats: ["users", "stats"] as const },
};
```

Use consistently across `useQuery` and `useMutation` invalidations.

**Step 1:** Commit.

---

## Task 11: Quality gate

1. `pnpm exec tsc --noEmit && pnpm run lint && pnpm run build`
2. `python -m pytest && python manage.py check && python manage.py makemigrations --dry-run`
3. Manual walkthrough:
   - Create a publication with TipTap, insert an image (R2 upload), save as draft, publish, view on `/publications/[slug]`.
   - Confirm `<script>` injected into TipTap is stripped on save (server) and on render (client).
   - Create an event, register as a non-staff user, view registration in dashboard.
   - Submit a help request from public `/get-help`, see it in `/dashboard/help-requests`, change status, add internal notes.
   - Toggle a user's `is_staff` and confirm middleware behaves correctly on next request.
4. Fix anything broken, commit.

---

## Task 12: Merge

```bash
gh pr create --title "Wave 2: Content & Operations" --body "..."
git worktree remove ../law_clinic-wave-2
```

Tag `v0.2.0-elegance-wave-2`.

---

## Acceptance criteria for Wave 2

- [ ] Stats endpoints exist for publications, events, help-requests, users; dashboard overview shows real numbers.
- [ ] R2 presigned-URL pipeline works end-to-end; ImageUploader reusable across categories.
- [ ] TipTap editor saves sanitized HTML; markdown publications still render correctly via the `content_format` switch.
- [ ] Server-side `bleach` sanitization is enforced — proven by a failing-then-passing test that injects `<script>`.
- [ ] `SanitizedHtml` is the **only** component that renders raw DB HTML; grep confirms.
- [ ] Publications dashboard: list + new + edit + status transitions working.
- [ ] Public `/publications` + `/publications/[slug]` redesigned editorially.
- [ ] Events: dashboard list + new + edit + registrations + categories; public list + detail + register/cancel flow.
- [ ] Help requests: status + assigned_to + internal_notes; inbox UI with master-detail.
- [ ] Users management: filters, role changes with confirm, activate/deactivate.
- [ ] All new endpoints have correct permissions; tests pass.
- [ ] No TypeScript errors, no lint errors, build succeeds.

**Next:** `2026-05-25-wave-3-cms-and-account.md`
