export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  /** Drop your uploaded photo at /public/authors/<slug>.jpg and set this path. */
  avatar?: string;
  expertise: string[];
  awards?: string[];
  social?: {
    linkedin?: string;
    x?: string;
    email?: string;
  };
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  articleCount: number;
  /** lucide-react icon name resolved in the UI */
  icon: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  /** Lightweight block content used by the reader. */
  body: ArticleBlock[];
  categorySlug: string;
  authorSlug: string;
  /** Display name (used for Firestore posts where there's no author entity). */
  authorName?: string;
  /** Cover image URL (Firebase Storage download URL, or a /public path). */
  cover?: string;
  readingTime: number;
  publishedAt: string; // ISO date
  featured?: boolean;
  trending?: boolean;
  tags?: string[];
}

export type ArticleBlock =
  | { type: "heading"; id: string; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "citation"; text: string; source: string }
  | { type: "list"; items: string[] };

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
}
