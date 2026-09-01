# Verdict Vault

**Where Law Meets Clarity** — a premium, motion-rich legal knowledge platform.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, and Lenis.

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

**No database setup is required to run the site.** Content lives in `lib/data.ts`
as typed objects, so the whole experience works immediately. Prisma is scaffolded
for when you're ready to move content into Postgres — see *Roadmap* below.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run db:push` | Push the Prisma schema to Postgres |
| `npm run db:studio` | Open Prisma Studio |

---

## Adding your own assets

The project deliberately ships **no placeholder images**. Image containers render
an intentional vault-styled panel until you supply a real file, so the layout never
looks broken while you're still gathering assets.

### Logo

Drop your official logo at `public/logo.svg`, then edit
`components/ui/logo.tsx` — replace the inline `<svg>` vault glyph with:

```tsx
import Image from "next/image";
<Image src="/logo.svg" alt="Verdict Vault" width={36} height={36} priority />
```

### Article covers

1. Save the image to `public/covers/<article-slug>.jpg`
2. In `lib/data.ts`, set the `cover` field on that article:

```ts
{
  slug: "the-anatomy-of-a-merger",
  cover: "/covers/the-anatomy-of-a-merger.jpg",
  // ...
}
```

### Author photos

1. Save to `public/authors/<author-slug>.jpg`
2. Set `avatar: "/authors/<author-slug>.jpg"` in `lib/data.ts`

Authors without a photo render elegant gold monogram initials — not a broken image.

---

## Design system

Everything derives from the brand: matte black, premium gold, vault geometry.

### Colour tokens (`tailwind.config.ts`)

| Token | Hex | Role |
| --- | --- | --- |
| `obsidian` | `#0A0A0C` | Page background |
| `ink` | `#08080A` | Deepest surface, footer |
| `charcoal` | `#141417` | Card surfaces |
| `graphite` | `#1C1C20` | Raised surfaces |
| `gold` | `#C9A15A` | Primary accent |
| `gold-pale` | `#E7CE96` | Hover / highlight |
| `gold-deep` | `#A47E3C` | Gradient terminus |
| `bone` | `#F5F3EE` | Primary text |
| `smoke` | `#8B8B90` | Secondary text |

### Typography

- **Display** — Playfair Display. Headlines, pull quotes, statistics.
- **Body / UI** — Inter. Paragraphs, navigation, labels, eyebrows.

Loaded via `next/font/google` in `app/layout.tsx` with `display: "swap"`, exposed
as the CSS variables `--font-display` and `--font-sans`.

### Signature device

Section headers use a **section mark and index** (`§ 01`) rather than generic
numbering. It's borrowed from how legal texts are actually cited, so the structure
encodes something true about the subject instead of just decorating it.

### Utility classes (`app/globals.css`)

`.shell` (max-width container) · `.eyebrow` · `.display-hero` ·
`.text-gold-gradient` · `.hairline` · `.glass` · `.grain`

---

## Motion layer

| Component | Effect |
| --- | --- |
| `motion/smooth-scroll.tsx` | Lenis inertial scrolling |
| `motion/text-reveal.tsx` | Masked word-by-word headline stagger |
| `motion/reveal.tsx` | Scroll-triggered fade + blur + rise |
| `motion/magnetic.tsx` | Cursor-attracted buttons |
| `motion/mouse-spotlight.tsx` | Ambient gold cursor glow |
| `motion/reading-progress.tsx` | Gold progress bar on articles |

Plus: parallax vault dial in the hero, a drawing gold rule, layout-animated blog
filtering, card elevation on hover, an animated command palette, and a floating
navbar that hides on scroll-down and returns on scroll-up.

**Accessibility is not an afterthought.** Every motion component checks
`prefers-reduced-motion` — Lenis and the spotlight disable entirely, and CSS
transitions collapse to near-zero duration.

---

## Project structure

```
app/
  layout.tsx              Root layout: fonts, metadata, chrome, providers
  page.tsx                Homepage (9 composed sections)
  globals.css             Design tokens, utilities, grain overlay
  loading.tsx             Vault-dial loading state
  not-found.tsx           Branded 404
  sitemap.ts              Dynamic sitemap
  robots.ts               robots.txt
  feed.xml/route.ts       RSS 2.0 feed
  blog/                   Index (filterable) + [slug] reader
  categories/             Index + [slug] with stats
  authors/                Index + [slug] profile
  about/                  Mission, values, timeline, editorial policy
  contact/                Details + validated form

components/
  navbar.tsx              Floating nav, scroll hide/reveal, mobile menu
  footer.tsx              Columns, practice areas, legal links
  blog-list.tsx           Category filtering with layout animation
  contact-form.tsx        Validation + success animation
  motion/                 Reusable animation primitives
  sections/               Homepage sections
  ui/                     Buttons, cards, search, newsletter, TOC, etc.

hooks/                    useMediaQuery, useReducedMotion, useScrolled
lib/                      utils.ts (cn, formatDate), data.ts, prisma.ts
types/                    Article, Author, Category, ArticleBlock
prisma/schema.prisma      Full Postgres data model
public/covers/            ← your article images
public/authors/           ← your author photos
```

---

## Content model

Articles use **structured blocks** rather than raw HTML, so the reader can render
each type with bespoke styling — and so the same data moves cleanly into Postgres
later (`Post.body` is a `Json` column matching `ArticleBlock[]`).

```ts
type ArticleBlock =
  | { type: "heading"; id: string; text: string }   // feeds the table of contents
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; cite?: string }  // large pull quote
  | { type: "citation"; text: string; source: string } // gold-ruled case citation
  | { type: "list"; items: string[] };
```

Headings automatically populate the sticky scroll-spy table of contents.

---

## SEO

- Per-route metadata via `generateMetadata`, with a title template
- JSON-LD: `Organization` on the homepage, `Article` on each post
- Open Graph and Twitter Card tags
- `sitemap.xml` covering all static, article, category, and author routes
- `robots.txt` (admin disallowed)
- RSS 2.0 feed at `/feed.xml`

Set your real domain in `app/layout.tsx` (`siteUrl`), `app/sitemap.ts`,
`app/robots.ts`, and `app/feed.xml/route.ts`.

---

## Verified build

```
✓ 29 pages generated
✓ 0 TypeScript errors (strict mode)
✓ 0 ESLint warnings
  First Load JS: ~102 kB shared, ~165 kB on the heaviest route
```

---

## Roadmap — what's next

This is a complete, production-quality **frontend**. Deliberately not yet built:

1. **Database wiring** — `prisma/schema.prisma` models User, Author, Category,
   Tag, Post, Comment, Subscriber, and MediaAsset. Set `DATABASE_URL`, run
   `npm run db:push`, then swap the helper functions in `lib/data.ts` for Prisma
   queries. Every helper (`getArticle`, `getArticlesByCategory`, …) is already
   isolated for exactly this swap — the components never touch the data source.
2. **Authentication** — role-based access (`READER` / `AUTHOR` / `EDITOR` / `ADMIN`)
3. **Admin CMS** — dashboard, post editor, media library, comment moderation
4. **Server actions** — newsletter subscription and the contact form currently
   resolve client-side with simulated success; point them at real endpoints
5. **Comments** — the schema supports threaded replies and approval

---

## Troubleshooting

### `npm audit` reports vulnerabilities

It shouldn't — this project resolves to **0 vulnerabilities**. Two transitive
dependencies of Next.js are pinned forward via npm `overrides` in `package.json`:

```json
"overrides": {
  "postcss": "$postcss",
  "sharp": "^0.35.3"
}
```

- **postcss** — Next bundles 8.4.31 internally, which carries a moderate XSS
  advisory. The override dedupes it to 8.5.22.
- **sharp** — used by Next for image optimization; versions below 0.35.0 inherit
  four high-severity libvips CVEs.

> **Do not run `npm audit fix --force`.** npm's naive resolver proposes
> downgrading to `next@9.3.3` — a six-year-old major version that would destroy
> the App Router and every page in this project. The overrides above are the
> correct fix.

### "Next.js inferred your workspace root" warning

This appears when a stray `package-lock.json` exists in a parent directory
(commonly `~/package-lock.json` from an earlier `npm install` run in your home
folder). `next.config.mjs` sets `outputFileTracingRoot` to this project's
directory, which silences it.

To remove the underlying cause:

```bash
rm ~/package-lock.json        # only if you don't need it
```

### Fonts fail to load on first build

`next/font/google` fetches Playfair Display and Inter at build time. The first
build needs network access to `fonts.googleapis.com`. They're cached afterwards.

---

## Notes

- Next.js is pinned to **15.5.21**, the patched 15.x release (15.1.6 carries a
  known advisory).
- `.env.example` documents every environment variable. Copy it to `.env.local`.
- Google Fonts are fetched at build time, so the first build needs network access.

---

© Verdict Vault

---

## Admin, submissions & Firebase (Phase 2)

This build adds a full admin system, a public "write for us" flow, and Firebase
persistence. **The site still runs with no setup** — without Firebase keys it
uses seed data and the admin UI shows a "demo mode" notice on each page.

### 1. Create a Firebase project

1. Go to <https://console.firebase.google.com> → **Add project**.
2. **Build ▸ Authentication ▸ Sign-in method** → enable **Email/Password**.
3. **Build ▸ Firestore Database ▸ Create database** (production mode).
4. **Project Settings ▸ General ▸ Your apps** → register a Web app and copy the
   config values into the `NEXT_PUBLIC_FIREBASE_*` vars in `.env.local`.
5. **Project Settings ▸ Service accounts ▸ Generate new private key** → copy
   `project_id`, `client_email`, and `private_key` into the server-side
   `FIREBASE_*` vars. Keep the private key's `\n` sequences intact, wrapped in
   double quotes.

Copy `.env.example` to `.env.local` and fill it in.

### 2. Create your admin user

In **Authentication ▸ Users ▸ Add user**, create an email/password. That's your
login at **/admin/login**. (There's no public sign-up — admins are provisioned
in the console on purpose.)

### 3. Publish the security rules

The repo ships `firestore.rules`. Publish them so published posts are public,
subscribers can opt in, and only signed-in admins can manage content:

```bash
firebase deploy --only firestore:rules
```

Summary of the rules: **posts** are readable when `status == "published"` (or by
admins); **submissions** can only be created server-side (via the Admin SDK) and
read by admins; **subscribers** can be created by anyone but read only by admins.

### 4. Submission alerts — email + one-tap WhatsApp (no Twilio)

When a reader submits at `/write`, the server saves it to Firestore and **emails
you instantly** (via Resend). Every submission also gets a **one-tap WhatsApp
button** in the admin that opens WhatsApp with the details pre-filled.

- **Email:** free API key from <https://resend.com>. Set `RESEND_API_KEY`,
  `ADMIN_NOTIFY_EMAIL`, and `RESEND_FROM_EMAIL` in `.env.local`.
- **WhatsApp button:** set `NEXT_PUBLIC_ADMIN_WHATSAPP` to your number (digits
  only, with country code). No API, no token — it builds a `wa.me` link.

Both are optional: with neither set, submissions still save and the message is
logged server-side. Full steps are in `SETUP.md`, Part 4.

> **Why the email key never lives in the browser:** the form posts to
> `/api/submit-post`, which runs on the server, writes to Firestore with the
> Admin SDK, then calls `/api/notify-email`. Credentials stay server-side. The
> WhatsApp button is a plain link, so it needs no secret at all.

### The submission → publish flow

1. A visitor writes a piece at **/write** and submits.
2. It's stored in Firestore as a `pending` submission; your WhatsApp buzzes.
3. You open **/admin/submissions**, read it, and **Approve** or **Reject**.
4. Approving creates a **draft** post from the submission.
5. In **/admin/posts** you edit if needed and flip status to **Published** —
   now it's live on the public site.

### Admin pages

- **/admin** — dashboard with live counts (posts, pending, subscribers)
- **/admin/posts** — full CRUD editor, publish/unpublish toggle
- **/admin/submissions** — review queue with approve/reject
- **/admin/subscribers** — newsletter list with CSV export

### Firestore collections

| Collection | Written by | Read by |
| --- | --- | --- |
| `posts` | Admins (client SDK) | Public (if published) + admins |
| `submissions` | Server (Admin SDK) | Admins |
| `subscribers` | Anyone (client SDK) | Admins |
