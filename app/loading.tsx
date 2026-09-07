import { VaultLoader } from "@/components/vault-loader";

/**
 * Route Suspense fallback. Next.js shows this the instant you navigate to a
 * page and KEEPS it on screen until that page's server component finishes —
 * which, for our pages, means until the Firestore data has loaded. So the
 * loader naturally stays up "until data loads," then the ready page appears.
 */
export default function Loading() {
  return <VaultLoader />;
}