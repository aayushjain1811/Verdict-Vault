"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

/**
 * Wraps every /admin page (except /admin/login). Shows a loader while auth
 * resolves, redirects to login if signed out, and renders the shell otherwise.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!isLogin && !loading && configured && !user) {
      router.replace("/admin/login");
    }
  }, [isLogin, loading, user, configured, router]);

  // Login page renders without the sidebar or the guard.
  if (isLogin) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
      </div>
    );
  }

  // When Firebase isn't configured yet, allow access so the UI is explorable
  // in demo mode (the pages themselves show a "connect Firebase" notice).
  if (configured && !user) return null;

  return (
    <div className="flex min-h-screen bg-obsidian">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden px-8 py-10 lg:px-12">
        {children}
      </main>
    </div>
  );
}
