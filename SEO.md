# SEO — what's built in

Verdict Vault ships search-engine-ready. This is the full inventory.

## Metadata

- **Title template** — every page becomes "`Page Title · Verdict Vault`"
  automatically (set in `app/layout.tsx`).
- **Per-page titles & descriptions** — home, blog, each article, each category,
  each author, about, contact, and write all set their own.
- **Canonical URLs** — every page declares its canonical path via
  `alternates.canonical`, preventing duplicate-content dilution.
- **`metadataBase`** — set to your domain so all relative URLs resolve to
  absolute ones in tags. Update it in `app/layout.tsx`.

## Structured data (JSON-LD)

Search engines read these to build rich results:

- **Organization** schema on the homepage.
- **Article** schema on every blog post — headline, description, publish date,
  author, publisher. This is what can earn article rich-results in Google.

## Social sharing (Open Graph + Twitter Cards)

- **Dynamic OG image** at `app/opengraph-image.tsx` — a branded 1200×630 card
  ("Law Explained. Clearly. Confidently.") generated on the fly with `next/og`.
  This is what appears when the site is shared on WhatsApp, LinkedIn, X, iMessage,
  Slack, etc.
- **Open Graph tags** — type, title, description, URL, locale, site name.
- **Twitter Card** — `summary_large_image`.
- Articles pass `type: "article"` with the publish time.

## Crawling & indexing

- **`sitemap.xml`** — generated dynamically at `/sitemap.xml`, covering all
  static pages plus every article, category, and author. New published posts
  appear automatically.
- **`robots.txt`** — generated at `/robots.txt`; allows everything except
  `/admin`, and points to the sitemap.
- **Admin is `noindex`** — the admin section sets `robots: { index: false }` so
  it never leaks into search.
- **RSS feed** — `/feed.xml`, linked from `<head>` via `alternates.types`.

## PWA / mobile

- **Web manifest** at `/manifest.webmanifest` — name, theme color, icons,
  categories. Enables "Add to home screen".
- **Theme color & color-scheme** — set via the `viewport` export.
- **SVG app icon** at `/icon.svg`.

## Performance = ranking

Core Web Vitals are a Google ranking factor. The performance work (see
`PERFORMANCE.md`) directly helps SEO: faster paints, no scroll jank, and static
generation of all content pages.

## Your go-live checklist

1. Set your real domain in `app/layout.tsx` (`siteUrl` / `metadataBase`) and in
   `sitemap.ts`, `robots.ts`, `feed.xml/route.ts`.
2. Deploy.
3. Verify the domain in Google Search Console and submit `sitemap.xml`.
4. Test the share card at <https://www.opengraph.xyz>.
5. Optionally submit the sitemap to Bing Webmaster Tools too.

That's it — everything else is automatic.
