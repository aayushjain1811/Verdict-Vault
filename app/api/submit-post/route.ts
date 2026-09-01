import { NextResponse } from "next/server";
import { adminDb, isAdminConfigured, uploadBufferToStorage } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Handles a public blog submission (multipart/form-data, so the cover image
 * comes through as a real file — no base64 bloat).
 *
 * Flow: validate → upload cover to Storage (Admin SDK) → write to Firestore
 * (`submissions`, status "pending") → email you. Writers are NOT logged in, so
 * the cover is uploaded server-side; Storage stays locked to admins for the
 * browser.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — bots fill this hidden field; humans leave it empty.
  if ((form.get("website") as string)?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const title = (form.get("title") as string)?.trim();
  const authorName = (form.get("authorName") as string)?.trim();
  const authorEmail = (form.get("authorEmail") as string)?.trim();
  const authorPhone = (form.get("authorPhone") as string)?.trim();
  const content = (form.get("content") as string)?.trim();
  const categorySlug = (form.get("categorySlug") as string)?.trim() || "uncategorised";
  const coverFile = form.get("cover") as File | null;

  if (!title || title.length < 4)
    return NextResponse.json({ error: "Please add a longer title." }, { status: 422 });
  if (!authorName)
    return NextResponse.json({ error: "Please add your name." }, { status: 422 });
  if (!authorEmail || !authorEmail.includes("@"))
    return NextResponse.json({ error: "Please add a valid email." }, { status: 422 });
  if (!authorPhone || authorPhone.replace(/\D/g, "").length < 8)
    return NextResponse.json({ error: "Please add a valid phone number." }, { status: 422 });
  if (!content || content.length < 200)
    return NextResponse.json(
      { error: "Your article looks short — please write at least a few paragraphs." },
      { status: 422 }
    );
  if (!coverFile || coverFile.size === 0)
    return NextResponse.json({ error: "Please attach a cover image." }, { status: 422 });
  if (!coverFile.type.startsWith("image/"))
    return NextResponse.json({ error: "The cover must be an image file." }, { status: 422 });
  if (coverFile.size > 8 * 1024 * 1024)
    return NextResponse.json({ error: "Cover image must be under 8 MB." }, { status: 422 });

  if (!isAdminConfigured || !adminDb) {
    console.log("[submit:demo] Firebase Admin not configured. Not stored:", title);
    return NextResponse.json({ ok: true, stored: false, demo: true });
  }

  // Upload the cover first.
  let coverUrl: string | null = null;
  try {
    const buf = Buffer.from(await coverFile.arrayBuffer());
    const safe = coverFile.name.replace(/[^a-zA-Z0-9.\-]/g, "_");
    coverUrl = await uploadBufferToStorage(
      buf,
      `submissions/${Date.now()}-${safe}`,
      coverFile.type
    );
  } catch (e) {
    console.error("Cover upload failed:", e);
  }
  if (!coverUrl) {
    return NextResponse.json(
      { error: "Could not upload the cover image. Make sure Storage is enabled." },
      { status: 500 }
    );
  }

  try {
    await adminDb.collection("submissions").add({
      title,
      authorName,
      authorEmail,
      authorPhone,
      categorySlug,
      content,
      cover: coverUrl,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (e) {
    console.error("Failed to store submission:", e);
    return NextResponse.json({ error: "Could not save your submission. Please try again." }, { status: 500 });
  }

  // Email you. Never block the response on it.
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    await fetch(`${base}/api/notify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        authorName,
        authorEmail,
        authorPhone,
        category: categorySlug,
        cover: coverUrl,
      }),
    });
  } catch (e) {
    console.error("Email notify call failed (submission still saved):", e);
  }

  return NextResponse.json({ ok: true, stored: true });
}