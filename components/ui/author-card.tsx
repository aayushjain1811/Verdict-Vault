import Link from "next/link";
import Image from "next/image";
import type { Author } from "@/types";

function Avatar({ author, size = 44 }: { author: Author; size?: number }) {
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/25 bg-gradient-to-br from-graphite to-ink text-sm font-medium text-gold"
      style={{ width: size, height: size }}
    >
      {author.avatar ? (
        <Image src={author.avatar} alt={author.name} fill className="object-cover" />
      ) : (
        <span className="font-display">{initials}</span>
      )}
    </div>
  );
}

export function AuthorCard({ author }: { author: Author }) {
  return (
    <Link
      href={`/authors/${author.slug}`}
      className="group flex items-center gap-4 rounded-2xl border border-gold/10 bg-charcoal/40 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-gold/30"
    >
      <Avatar author={author} size={56} />
      <div>
        <h3 className="text-base text-bone transition-colors group-hover:text-gold-pale">
          {author.name}
        </h3>
        <p className="mt-0.5 text-xs text-smoke">{author.role}</p>
      </div>
    </Link>
  );
}

export { Avatar };
