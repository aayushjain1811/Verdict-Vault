"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Inbox,
  Mail,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/admin/login");
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-gold/12 bg-ink px-5 py-7">
      <Link href="/admin" className="flex items-center gap-3 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-charcoal">
          <svg viewBox="0 0 32 32" className="h-5 w-5 text-gold" fill="none">
            <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="16" cy="16" r="5.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M16 4v3M16 25v3M4 16h3M25 16h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
        <div className="leading-none">
          <p className="font-display text-sm text-bone">Verdict Vault</p>
          <p className="docket mt-1 !text-[9px] !text-gold/50">Control Room</p>
        </div>
      </Link>

      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-gold/10 text-gold-pale"
                  : "text-smoke hover:bg-gold/5 hover:text-bone"
              )}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-gold/10 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-smoke transition-colors hover:text-bone"
        >
          <ArrowUpRight className="h-4 w-4" /> View site
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-smoke transition-colors hover:text-rose-300"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
        {user?.email && (
          <p className="truncate px-3 pt-2 text-[11px] text-ash">{user.email}</p>
        )}
      </div>
    </aside>
  );
}
