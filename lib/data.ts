import type { Article, Author, Category, Testimonial } from "@/types";

/**
 * Editorial seed content.
 * This keeps the site fully runnable with no database. When you wire up
 * Prisma/Postgres (see prisma/schema.prisma), swap these reads for queries.
 */

export const categories: Category[] = [
  { slug: "corporate-law", name: "Corporate Law", description: "Governance, M&A, and the machinery of the modern enterprise.", articleCount: 42, icon: "Building2" },
  { slug: "criminal-law", name: "Criminal Law", description: "Rights, procedure, and the architecture of due process.", articleCount: 31, icon: "Scale" },
  { slug: "civil-law", name: "Civil Law", description: "Contracts, torts, and the resolution of private disputes.", articleCount: 28, icon: "Handshake" },
  { slug: "constitutional-law", name: "Constitutional Law", description: "The foundational text and the doctrines built upon it.", articleCount: 19, icon: "Landmark" },
  { slug: "family-law", name: "Family Law", description: "Marriage, custody, and the law of private life.", articleCount: 24, icon: "Users" },
  { slug: "tax-law", name: "Tax Law", description: "Structure, compliance, and the calculus of obligation.", articleCount: 17, icon: "Receipt" },
  { slug: "property-law", name: "Property Law", description: "Title, tenancy, and the rules of ownership.", articleCount: 22, icon: "KeyRound" },
  { slug: "intellectual-property", name: "Intellectual Property", description: "Patents, marks, and the ownership of ideas.", articleCount: 26, icon: "Fingerprint" },
];

export const authors: Author[] = [
  {
    slug: "adaeze-okonkwo",
    name: "Adaeze Okonkwo",
    role: "Editor-in-Chief · Corporate & Securities",
    bio: "Adaeze spent a decade advising boards through cross-border transactions before turning to legal writing. She believes the best legal analysis reads like a well-argued brief and a good essay at once.",
    expertise: ["Mergers & Acquisitions", "Securities", "Corporate Governance"],
    awards: ["Legal Writer of the Year, 2024", "Financial Times Innovative Lawyers"],
    social: { linkedin: "#", x: "#", email: "adaeze@verdictvault.example" },
  },
  {
    slug: "marcus-hale",
    name: "Marcus Hale",
    role: "Senior Contributor · Criminal & Constitutional",
    bio: "A former public defender, Marcus writes about the parts of the law that decide who walks free. His work centers procedure, precedent, and the human stakes underneath both.",
    expertise: ["Criminal Procedure", "Civil Liberties", "Appellate Practice"],
    awards: ["National Press Foundation Fellow"],
    social: { linkedin: "#", x: "#", email: "marcus@verdictvault.example" },
  },
  {
    slug: "priya-nair",
    name: "Priya Nair",
    role: "Contributor · IP & Technology",
    bio: "Priya translates the frontier of technology law — from patent thickets to algorithmic accountability — into prose a founder can act on.",
    expertise: ["Patents", "Data Protection", "Technology Transactions"],
    social: { linkedin: "#", x: "#", email: "priya@verdictvault.example" },
  },
];

export const articles: Article[] = [];

export const testimonials: Testimonial[] = [
  { quote: "The clearest legal writing I read all year. Verdict Vault treats readers like intelligent adults and the law like a craft.", name: "Eleanor Vance", title: "General Counsel, Meridian Group" },
  { quote: "I send new associates here before I send them to the treatises. It is the fastest way to understand why the law works the way it does.", name: "David Osei", title: "Partner, Osei & Blackwood" },
  { quote: "Beautiful, precise, and never condescending. This is what legal publishing should have looked like all along.", name: "Sofia Marchetti", title: "Professor of Law" },
];

// --- Helpers ---------------------------------------------------------------

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
export function getAuthor(slug: string) {
  return authors.find((a) => a.slug === slug);
}
export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
export function getArticlesByCategory(slug: string) {
  return articles.filter((a) => a.categorySlug === slug);
}
export function getArticlesByAuthor(slug: string) {
  return articles.filter((a) => a.authorSlug === slug);
}
export function featuredArticle() {
  return articles.find((a) => a.featured) ?? articles[0];
}
export function trendingArticles() {
  return articles.filter((a) => a.trending);
}
export function relatedArticles(slug: string, categorySlug: string, limit = 3) {
  return articles
    .filter((a) => a.slug !== slug && a.categorySlug === categorySlug)
    .concat(articles.filter((a) => a.slug !== slug && a.categorySlug !== categorySlug))
    .slice(0, limit);
}
