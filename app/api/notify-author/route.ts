import { NextResponse } from "next/server";

/**
 * Emails the WRITER when their submission is approved and published.
 * Uses Resend (same key as the admin alert). Degrades gracefully if not set.
 */
interface Body {
  title: string;
  authorName: string;
  authorEmail: string;
}

export async function POST(request: Request) {
  let data: Body;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Verdict Vault <onboarding@resend.dev>";
  const site = process.env.NEXT_PUBLIC_SITE_URL || "";

  if (!apiKey || !data.authorEmail) {
    console.log("[author-email:disabled] Would notify:", data.authorEmail, data.title);
    return NextResponse.json({ ok: true, delivered: false });
  }

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:520px;margin:auto">
      <div style="border-left:3px solid #C9A15A;padding:4px 0 4px 16px;margin-bottom:20px">
        <p style="color:#C9A15A;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0">
          Published on Verdict Vault
        </p>
        <h2 style="margin:6px 0 0;color:#111">Your article is live 🎉</h2>
      </div>
      <p style="font-size:15px;color:#333;line-height:1.7">
        Hi ${escapeHtml(data.authorName)}, good news — your submission
        <strong>“${escapeHtml(data.title)}”</strong> has been reviewed and published
        on Verdict Vault. Thank you for contributing.
      </p>
      ${
        site
          ? `<p style="margin-top:24px">
               <a href="${site}/blog" style="background:#C9A15A;color:#0a0a0c;text-decoration:none;padding:10px 20px;border-radius:999px;font-size:14px;font-weight:600">
                 Read it on Verdict Vault →
               </a>
             </p>`
          : ""
      }
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [data.authorEmail],
        subject: `Your article is published: ${data.title}`,
        html,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (e) {
    console.error("Author email failed:", e);
    return NextResponse.json({ ok: true, delivered: false });
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}