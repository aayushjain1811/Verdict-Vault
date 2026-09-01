import { NextResponse } from "next/server";

/**
 * Emails the admin when a new submission arrives.
 *
 * Uses Resend (https://resend.com) — one free API key, no phone/SMS provider.
 * If RESEND_API_KEY isn't set, the route degrades gracefully: it logs and
 * returns ok, so submissions never fail just because email isn't wired yet.
 *
 * WHY A SERVER ROUTE: the API key must never reach the browser. This runs
 * server-side only.
 */

interface NotifyBody {
  title: string;
  authorName: string;
  authorEmail: string;
  authorPhone?: string;
  category: string;
  cover?: string;
}

export async function POST(request: Request) {
  let data: NotifyBody;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || "Verdict Vault <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.log(
      "[email:disabled] New submission (email not configured):",
      data.title,
      "by",
      data.authorName
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:520px;margin:auto">
      <div style="border-left:3px solid #C9A15A;padding:4px 0 4px 16px;margin-bottom:20px">
        <p style="color:#C9A15A;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0">
          New Submission
        </p>
        <h2 style="margin:6px 0 0;color:#111">${escapeHtml(data.title)}</h2>
      </div>
      <table style="font-size:14px;color:#333;line-height:1.7">
        <tr><td style="color:#888;padding-right:16px">Author</td><td>${escapeHtml(data.authorName)}</td></tr>
        <tr><td style="color:#888;padding-right:16px">Email</td><td>${escapeHtml(data.authorEmail)}</td></tr>
        <tr><td style="color:#888;padding-right:16px">Phone</td><td>${escapeHtml(data.authorPhone || "—")}</td></tr>
        <tr><td style="color:#888;padding-right:16px">Category</td><td>${escapeHtml(data.category)}</td></tr>
      </table>
      ${data.cover ? `<img src="${data.cover}" alt="cover" style="margin-top:16px;width:100%;max-width:480px;border-radius:8px"/>` : ""}
      <p style="margin-top:24px">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin/submissions"
           style="background:#C9A15A;color:#0a0a0c;text-decoration:none;padding:10px 20px;border-radius:999px;font-size:14px;font-weight:600">
          Review in admin →
        </a>
      </p>
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
        to: [to],
        subject: `📝 New submission: ${data.title}`,
        html,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (e) {
    console.error("Email notify failed:", e);
    // Never fail the submission because of a notification hiccup.
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