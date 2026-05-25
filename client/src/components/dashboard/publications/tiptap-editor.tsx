"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { uploadImage } from "@/lib/uploads";
import { useRef } from "react";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  publicationId: string;
  placeholder?: string;
}

export function TiptapEditor({
  value,
  onChange,
  publicationId,
  placeholder,
}: TiptapEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: "rounded-lg my-4 max-w-full" } }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "underline text-primary" },
      }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
      Typography,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose-editorial max-w-none focus:outline-none min-h-[400px] p-4 text-ink",
      },
    },
  });

  if (!editor) return null;

  const insertImage = async (file: File) => {
    const url = await uploadImage({
      file,
      category: "publications",
      id: publicationId,
    });
    editor.chain().focus().setImage({ src: url }).run();
  };

  const Btn = ({
    icon: Icon,
    action,
    active,
    label,
  }: {
    icon: React.ElementType;
    action: () => void;
    active?: boolean;
    label: string;
  }) => (
    <button
      type="button"
      onClick={action}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`rounded-md p-1.5 text-ink-muted hover:bg-surface-muted transition-colors ${active ? "bg-surface-muted text-ink" : ""}`}
    >
      <Icon className="size-4" />
    </button>
  );

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5 bg-surface-muted/30">
        <Btn
          icon={Undo}
          action={() => editor.chain().focus().undo().run()}
          label="Undo"
        />
        <Btn
          icon={Redo}
          action={() => editor.chain().focus().redo().run()}
          label="Redo"
        />
        <div className="mx-1 h-5 w-px bg-border" />
        <Btn
          icon={Heading2}
          action={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          label="Heading 2"
        />
        <Btn
          icon={Heading3}
          action={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          label="Heading 3"
        />
        <div className="mx-1 h-5 w-px bg-border" />
        <Btn
          icon={Bold}
          action={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="Bold"
        />
        <Btn
          icon={Italic}
          action={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="Italic"
        />
        <Btn
          icon={Quote}
          action={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          label="Quote"
        />
        <Btn
          icon={Code}
          action={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          label="Inline code"
        />
        <div className="mx-1 h-5 w-px bg-border" />
        <Btn
          icon={List}
          action={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="Bullet list"
        />
        <Btn
          icon={ListOrdered}
          action={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="Numbered list"
        />
        <div className="mx-1 h-5 w-px bg-border" />
        <Btn
          icon={Link2}
          action={() => {
            const url = window.prompt("Enter URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          active={editor.isActive("link")}
          label="Link"
        />
        <Btn
          icon={ImageIcon}
          action={() => fileRef.current?.click()}
          label="Insert image"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && insertImage(e.target.files[0])
          }
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
