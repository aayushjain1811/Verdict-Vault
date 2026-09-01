import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { HiddenAdminLink } from "@/components/ui/hidden-admin-link";
import { categories } from "@/lib/data";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Articles", href: "/blog" },
      { label: "Categories", href: "/categories" },
      { label: "Authors", href: "/authors" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Newsletter", href: "/#newsletter" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-gold/12 bg-ink">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-smoke">
            A premium legal knowledge platform. We explain the law with the
            precision it deserves and the clarity it too often lacks.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-4 text-[11px] uppercase tracking-eyebrow text-gold/60">
              {col.title}
            </p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-smoke transition-colors hover:text-bone"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="mb-4 text-[11px] uppercase tracking-eyebrow text-gold/60">
            Practice Areas
          </p>
          <ul className="space-y-3">
            {categories.slice(0, 4).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="text-sm text-smoke transition-colors hover:text-bone"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hairline mx-auto max-w-[1240px]" />
      <div className="shell flex flex-col items-center justify-between gap-4 py-8 text-xs text-smoke md:flex-row">
        <p>© {new Date().getFullYear()} Verdict Vault. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="#" className="hover:text-bone">Privacy</Link>
          <Link href="#" className="hover:text-bone">Terms</Link>
          <Link href="#" className="hover:text-bone">Editorial Policy</Link>
          <HiddenAdminLink />
        </div>
      </div>
    </footer>
  );
}
