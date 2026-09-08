import { NextResponse } from "next/server";

/**
 * Sends contact-form submissions to the site owner's inbox via Resend.
 * Recipient is CONTACT_EMAIL (falls back to a hardcoded default).
 */
interface Body {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  website?: string; // honeypot
}

export async function POST(request: Request) {
  let data: Body;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — silently accept bot spam without emailing.
  if (data.website?.trim()) return NextResponse.json({ ok: true });

  const name = data.name?.trim();
  const email = data.email?.trim();
  const subject = data.subject?.trim() || "(no subject)";
  const message = data.message?.trim();

  if (!name) return NextResponse.json({ error: "Please add your name." }, { status: 422 });
  if (!email || !email.includes("@"))
    return NextResponse.json({ error: "Please add a valid email." }, { status: 422 });
  if (!message || message.length < 10)
    return NextResponse.json({ error: "Please write a longer message." }, { status: 422 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Verdict Vault <onboarding@resend.dev>";
  const to = process.env.CONTACT_EMAIL || "verdictvault2026@gmail.com";

  if (!apiKey) {
    console.log("[contact:disabled] Would email", to, "-", subject, "from", email);
    return NextResponse.json({ ok: true, delivered: false });
  }

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:auto">
      <div style="border-left:3px solid #C9A15A;padding:4px 0 4px 16px;margin-bottom:20px">
        <p style="color:#C9A15A;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0">
          New contact message
        </p>
        <h2 style="margin:6px 0 0;color:#111">${escapeHtml(subject)}</h2>
      </div>
      <table style="font-size:14px;color:#333;border-collapse:collapse">
        <tr><td style="color:#888;padding-right:16px">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="color:#888;padding-right:16px">Email</td><td>${escapeHtml(email)}</td></tr>
      </table>
      <p style="margin-top:16px;font-size:15px;color:#222;line-height:1.7;white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email, // so you can reply straight to the sender
        subject: `Contact: ${subject}`,
        html,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (e) {
    console.error("Contact email failed:", e);
    return NextResponse.json({ error: "Could not send. Please try again." }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}