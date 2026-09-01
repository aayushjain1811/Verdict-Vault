"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AmbientGlow } from "@/components/motion/ambient-glow";
import { MouseSpotlight } from "@/components/motion/mouse-spotlight";
import { AdminShortcut } from "@/components/admin-shortcut";

/**
 * Decides which chrome wraps the page.
 *
 * Admin routes (/admin, /admin/login, …) render their OWN shell — a sidebar and
 * header from AdminGuard — so they must NOT also get the public navbar, footer,
 * cursor glow, or ambient orbs. Previously the root layout wrapped everything in
 * that public chrome, which bled over the admin dashboard. This gates it.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin owns its full-screen layout. No public chrome, no decorative layers.
    return <>{children}</>;
  }

  return (
    <>
      <AdminShortcut />
      <AmbientGlow />
      <MouseSpotlight />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </>
  );
}