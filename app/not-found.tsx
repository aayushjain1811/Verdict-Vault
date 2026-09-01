import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-vault-radial px-6">
      <div className="text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-5 font-display text-5xl text-bone md:text-7xl">
          This vault is empty.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-smoke">
          The page you asked for does not exist, or it has been moved. The
          archive is still open.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/" variant="gold">
            Back to home
          </Button>
          <Link
            href="/blog"
            className="text-sm text-smoke transition-colors hover:text-gold"
          >
            Browse articles
          </Link>
        </div>
      </div>
    </div>
  );
}
