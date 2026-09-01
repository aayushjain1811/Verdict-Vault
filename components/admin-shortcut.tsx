"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Secret admin trigger.
 *
 * Press  Ctrl + Shift + A  (or  ⌘ + Shift + A  on Mac)  anywhere on the public
 * site to jump to /admin/login. Nothing is shown on screen — it's a hidden
 * shortcut for you. The middleware still guards /admin, so this is just a fast
 * way in, not a security bypass.
 *
 * It ignores the shortcut while you're typing in an input/textarea so it never
 * fires by accident mid-sentence.
 */
export function AdminShortcut() {
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el as HTMLElement)?.isContentEditable;
      if (typing) return;

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        router.push("/admin/login");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return null;
}