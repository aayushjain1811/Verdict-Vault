"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Inbox, Mail, CheckCircle2, ArrowUpRight } from "lucide-react";
import { PageHeader, StatTile, AdminCard, StatusBadge, NotWiredNotice } from "@/components/admin/admin-ui";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import {
  fetchPosts,
  fetchSubmissions,
  fetchSubscribers,
  type PostDoc,
  type SubmissionDoc,
} from "@/lib/firebase/firestore";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<PostDoc[]>([]);
  const [subs, setSubs] = useState<SubmissionDoc[]>([]);
  const [subscribers, setSubscribers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    Promise.all([fetchPosts(), fetchSubmissions(), fetchSubscribers()])
      .then(([p, s, subscribersList]) => {
        setPosts(p);
        setSubs(s);
        setSubscribers(subscribersList.length);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const published = posts.filter((p) => p.status === "published").length;
  const pending = subs.filter((s) => s.status === "pending").length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Everything that moves through Verdict Vault, at a glance."
      />

      {!isFirebaseConfigured && <NotWiredNotice what="Live metrics" />}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Published" value={loading ? "—" : published} hint="Live on the site" />
        <StatTile label="Total posts" value={loading ? "—" : posts.length} hint="All statuses" />
        <StatTile label="Pending review" value={loading ? "—" : pending} hint="Reader submissions" />
        <StatTile label="Subscribers" value={loading ? "—" : subscribers} hint="Newsletter list" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl text-bone">Awaiting your review</h2>
            <Link href="/admin/submissions" className="wipe-link flex items-center gap-1 text-xs text-gold">
              All submissions <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-ash">Loading…</p>
          ) : subs.filter((s) => s.status === "pending").length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-ash">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Inbox zero. Nothing pending.
            </p>
          ) : (
            <ul className="space-y-3">
              {subs.filter((s) => s.status === "pending").slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 border-b border-gold/8 pb-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-bone">{s.title}</p>
                    <p className="truncate text-xs text-ash">by {s.authorName}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl text-bone">Recent posts</h2>
            <Link href="/admin/posts" className="wipe-link flex items-center gap-1 text-xs text-gold">
              Manage posts <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-ash">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-ash">No posts yet. Create your first one.</p>
          ) : (
            <ul className="space-y-3">
              {posts.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 border-b border-gold/8 pb-3">
                  <p className="min-w-0 truncate text-sm text-bone">{p.title}</p>
                  <StatusBadge status={p.status} />
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { href: "/admin/posts", label: "Write a post", icon: FileText },
          { href: "/admin/submissions", label: "Review submissions", icon: Inbox },
          { href: "/admin/subscribers", label: "Export subscribers", icon: Mail },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="group flex items-center gap-3 rounded-xl border border-gold/12 bg-charcoal/40 p-5 transition-colors hover:border-gold/30"
          >
            <a.icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
            <span className="text-sm text-bone">{a.label}</span>
            <ArrowUpRight className="ml-auto h-4 w-4 text-gold/40 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
