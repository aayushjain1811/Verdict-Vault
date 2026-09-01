import Link from "next/link";

/**
 * A deliberately discreet admin entry point. It renders as a tiny, low-contrast
 * dot at the edge of the footer — unnoticeable to visitors, but a quick way in
 * for you. It only *links* to the login; the middleware still enforces auth, so
 * this is convenience, not a security hole.
 */
export function HiddenAdminLink() {
  return (
    <Link
      href="/admin/login"
      aria-label="Admin"
      title="Admin"
      className="inline-block h-2 w-2 rounded-full bg-gold/20 transition-colors duration-300 hover:bg-gold/80"
    />
  );
}
