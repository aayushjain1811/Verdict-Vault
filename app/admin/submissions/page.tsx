"use client";

import { useEffect, useState } from "react";
import { Check, X, Eye, Inbox } from "lucide-react";
import { PageHeader, AdminCard, StatusBadge, AdminButton, NotWiredNotice } from "@/components/admin/admin-ui";
import { WhatsAppLink } from "@/components/admin/whatsapp-link";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { categories } from "@/lib/data";
import {
  fetchSubmissions,
  setSubmissionStatus,
  promoteSubmission,
  type SubmissionDoc,
} from "@/lib/firebase/firestore";

function forwardMessage(s: { title: string; authorName: string; authorEmail: string; authorPhone?: string }) {
  return [
    "New Verdict Vault submission",
    "",
    `Title: ${s.title}`,
    `Author: ${s.authorName} (${s.authorEmail})`,
    s.authorPhone ? `Phone: ${s.authorPhone}` : "",
    "",
    "Review it in the admin panel.",
  ].filter(Boolean).join("\n");
}

function writerMessage(name: string, title: string) {
  return [
    `Hi ${name},`,
    "",
    `Good news — your article "${title}" has been approved and is now published on Verdict Vault. Thank you for contributing!`,
  ].join("\n");
}

export default function AdminSubmissionsPage() {
  const [subs, setSubs] = useState<SubmissionDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<SubmissionDoc | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setSubs(await fetchSubmissions());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function approve(s: SubmissionDoc) {
    setBusy(s.id);
    try {
      await promoteSubmission(s);
      setOpen(null);
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function reject(s: SubmissionDoc) {
    setBusy(s.id);
    try {
      await setSubmissionStatus(s.id, "rejected");
      setOpen(null);
      await load();
    } finally {
      setBusy(null);
    }
  }

  const filtered = filter === "all" ? subs : subs.filter((s) => s.status === filter);

  return (
    <div>
      <PageHeader
        title="Submissions"
        description="Reader-written drafts arrive here and email you instantly. Tap WhatsApp to forward one to your phone, then approve to create a draft post."
      />

      {!isFirebaseConfigured && <NotWiredNotice what="Submission review" />}

      <div className="mb-6 flex flex-wrap gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm capitalize transition-colors ${
              filter === f
                ? "border-gold/50 bg-gold/10 text-gold-pale"
                : "border-gold/15 text-smoke hover:text-bone"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ash">Loading…</p>
      ) : filtered.length === 0 ? (
        <AdminCard className="flex flex-col items-center py-16 text-center">
          <Inbox className="mb-4 h-10 w-10 text-gold/30" />
          <p className="text-smoke">No {filter === "all" ? "" : filter} submissions.</p>
        </AdminCard>
      ) : (
        <div className="grid gap-4">
          {filtered.map((s) => (
            <AdminCard key={s.id} className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-1.5 flex items-center gap-3">
                  <StatusBadge status={s.status} />
                  <span className="docket !text-ash">
                    {categories.find((c) => c.slug === s.categorySlug)?.name ?? "Uncategorised"}
                  </span>
                </div>
                <h3 className="font-display text-xl text-bone">{s.title}</h3>
                <p className="mt-1 text-sm text-ash">
                  {s.authorName} · {s.authorEmail}
                  {s.authorPhone ? ` · ${s.authorPhone}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {s.status === "approved" ? (
                  <WhatsAppLink
                    phone={s.authorPhone}
                    label="Message writer"
                    message={writerMessage(s.authorName, s.title)}
                  />
                ) : (
                  <WhatsAppLink
                    phone={process.env.NEXT_PUBLIC_ADMIN_WHATSAPP}
                    label="Forward to me"
                    message={forwardMessage(s)}
                  />
                )}
                <AdminButton variant="ghost" onClick={() => setOpen(s)}>
                  <Eye className="h-4 w-4" /> Read
                </AdminButton>
                {s.status === "pending" && (
                  <>
                    <AdminButton onClick={() => approve(s)} disabled={busy === s.id}>
                      <Check className="h-4 w-4" /> Approve
                    </AdminButton>
                    <AdminButton variant="danger" onClick={() => reject(s)} disabled={busy === s.id}>
                      <X className="h-4 w-4" /> Reject
                    </AdminButton>
                  </>
                )}
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {/* Reader view */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/70 backdrop-blur-sm">
          <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-gold/15 bg-obsidian p-10">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <StatusBadge status={open.status} />
                <h2 className="mt-3 font-display text-3xl text-bone">{open.title}</h2>
                <p className="mt-2 text-sm text-ash">
                  {open.authorName} · {open.authorEmail}
                </p>
              </div>
              <button onClick={() => setOpen(null)} className="text-smoke hover:text-bone">
                <X className="h-5 w-5" />
              </button>
            </div>
            {open.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={open.cover}
                alt="Cover"
                className="mb-6 w-full rounded-xl border border-gold/12 object-cover"
              />
            )}
            <div className="space-y-4 font-read text-[15px] leading-relaxed text-smoke">
              {open.content.split(/\n{2,}/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {open.status === "pending" && (
              <div className="mt-8 flex gap-3 border-t border-gold/12 pt-6">
                <WhatsAppLink
                  phone={process.env.NEXT_PUBLIC_ADMIN_WHATSAPP}
                  label="Forward to me"
                  message={forwardMessage(open)}
                />
                <AdminButton onClick={() => approve(open)} disabled={busy === open.id}>
                  <Check className="h-4 w-4" /> Approve &amp; create draft
                </AdminButton>
                <AdminButton variant="danger" onClick={() => reject(open)} disabled={busy === open.id}>
                  <X className="h-4 w-4" /> Reject
                </AdminButton>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}