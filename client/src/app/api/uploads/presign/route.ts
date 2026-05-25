import { NextResponse } from "next/server";
import { z } from "zod";
import { buildObjectKey, presignPut, publicUrl, UploadCategory } from "@/lib/r2";
import { getUser } from "@/services/server/auth";

const Schema = z.object({
  category: z.enum(["publications", "gallery", "avatars", "sponsors", "events"]),
  filename: z.string().min(1).max(255),
  contentType: z.string().regex(/^image\//),
  id: z.string().min(1).max(64),
});

export async function POST(req: Request) {
  const { data: user } = await getUser();
  if (!user?.is_staff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const key = buildObjectKey(parsed.data as { category: UploadCategory; filename: string; id: string });
    const uploadUrl = await presignPut(key, parsed.data.contentType);
    return NextResponse.json({
      uploadUrl,
      publicUrl: publicUrl(key),
      expiresInSeconds: 600,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
