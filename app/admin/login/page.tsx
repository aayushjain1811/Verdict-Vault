"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function AdminLoginPage() {
  const { user, signIn, configured, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/admin");
  }, [user, loading, router]);

  async function submit() {
    setError("");
    setBusy(true);
    try {
      await signIn(email, password);
      router.replace("/admin");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Sign-in failed.";
      setError(
        msg.includes("auth/") ? "Incorrect email or password." : msg
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(800px 500px at 50% 0%, rgba(201,161,90,.08), transparent 60%)",
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-gold/30 bg-charcoal">
            <svg viewBox="0 0 32 32" className="h-7 w-7 text-gold" fill="none">
              <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="16" cy="16" r="5.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M16 4v3M16 25v3M4 16h3M25 16h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <h1 className="font-display text-3xl text-bone">Control Room</h1>
          <p className="docket mt-2 !text-gold/50">Authorised personnel only</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {!configured && (
            <div className="mb-6 flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 text-sm text-amber-200/90">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Firebase isn’t configured yet. Add your keys to{" "}
                <code className="text-amber-100">.env.local</code> (see README),
                then create an admin user in the Firebase console.
              </p>
            </div>
          )}

          <label className="mb-2 block text-[11px] uppercase tracking-eyebrow text-gold/60">
            Email
          </label>
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-gold/15 bg-ink/60 px-4">
            <Mail className="h-4 w-4 text-gold/60" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@verdictvault.co.in"
              className="w-full bg-transparent py-3 text-sm text-bone outline-none placeholder:text-ash"
            />
          </div>

          <label className="mb-2 block text-[11px] uppercase tracking-eyebrow text-gold/60">
            Password
          </label>
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-gold/15 bg-ink/60 px-4">
            <Lock className="h-4 w-4 text-gold/60" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="••••••••"
              className="w-full bg-transparent py-3 text-sm text-bone outline-none placeholder:text-ash"
            />
          </div>

          {error && (
            <p className="mb-4 text-sm text-rose-300">{error}</p>
          )}

          <button
            onClick={submit}
            disabled={busy || !configured}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient py-3 text-sm font-medium text-ink transition-all hover:brightness-110 disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
            {!busy && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-ash">
          <Link href="/" className="wipe-link hover:text-gold">
            ← Back to Verdict Vault
          </Link>
        </p>
      </div>
    </div>
  );
}