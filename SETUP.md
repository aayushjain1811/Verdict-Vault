# Verdict Vault — Complete Setup Guide

Everything from an empty machine to a live, SEO-indexed site with a working
admin panel and WhatsApp notifications. Follow the parts you need in order.

The site **runs with zero configuration** — you can do Part 1 and stop. Firebase,
WhatsApp, and deployment (Parts 3–6) light up the dynamic features when ready.

---

## Part 1 — Run it locally (5 minutes)

**Prerequisite:** Node.js 18.18 or newer. Check with `node -v`. If you don't
have it, install the LTS from <https://nodejs.org>.

```bash
# 1. Unzip, then enter the folder
cd verdict-vault

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open <http://localhost:3000>. The whole site works on built-in sample content.
The admin panel (`/admin`) and submission page (`/write`) run in "demo mode"
until you connect Firebase.

> If you see a warning about multiple lockfiles, delete the stray one it names
> (usually `~/package-lock.json`). It's harmless either way.

---

## Part 2 — First things to customise

| What | Where |
| --- | --- |
| Your logo | Drop `public/logo.svg`, then edit `components/ui/logo.tsx` |
| Article images | `public/covers/<slug>.jpg` + set `cover` in `lib/data.ts` |
| Author photos | `public/authors/<slug>.jpg` + set `avatar` in `lib/data.ts` |
| Site domain (for SEO) | `siteUrl` in `app/layout.tsx`, and `BASE` in `app/sitemap.ts`, `app/robots.ts`, `app/feed.xml/route.ts` |
| Sample articles/authors | `lib/data.ts` |

---

## Part 3 — Connect Firebase (auth + database)

This powers login, the admin CRUD, submissions, and the newsletter list.

### 3.1 Create the project
1. <https://console.firebase.google.com> → **Add project**.
2. **Build ▸ Authentication ▸ Get started ▸ Email/Password** → enable.
3. **Build ▸ Firestore Database ▸ Create database** → Production mode →
   pick a region close to your users.

### 3.2 Get the CLIENT keys (browser-safe)
1. **Project Settings (gear) ▸ General ▸ Your apps ▸ Web (`</>`)** → register app.
2. Copy the `firebaseConfig` values.

### 3.3 Get the ADMIN keys (server-only, secret)
1. **Project Settings ▸ Service accounts ▸ Generate new private key** → downloads a JSON file.
2. From that JSON you need `project_id`, `client_email`, and `private_key`.

### 3.4 Fill in your environment
```bash
cp .env.example .env.local
```
Open `.env.local` and paste:

```bash
# Client (from 3.2)
NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-app"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abc123"

# Admin (from 3.3) — keep the \n sequences inside the quotes exactly as-is
FIREBASE_PROJECT_ID="your-app"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-app.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

Restart `npm run dev` after editing env vars.

### 3.5 Create your admin login
**Authentication ▸ Users ▸ Add user** → enter an email + password.
That's your login at **/admin/login**. (No public signup — deliberate.)

### 3.6 Publish the security rules
Install the CLI once: `npm i -g firebase-tools`, then:
```bash
firebase login
firebase use --add          # pick your project, alias it "default"
firebase deploy --only firestore:rules
```
The included `firestore.rules` makes published posts public, lets anyone
subscribe, and restricts everything else to signed-in admins.

**Test it:** go to `/admin/login`, sign in, create a post, set it to Published —
it should appear on `/blog`.

---

## Part 4 — Submission alerts (no Twilio, no WhatsApp API)

When someone submits at `/write`, two things happen — set up either, both, or
neither (submissions always save to Firestore regardless).

### 4A. Instant email alert (via Resend — free, one key)

Resend sends you an email the moment a submission arrives. No phone/SMS provider.

1. Sign up free at <https://resend.com>.
2. **API Keys ▸ Create API Key** → copy it.
3. In `.env.local`:
   ```bash
   RESEND_API_KEY="re_xxxxxxxx"
   ADMIN_NOTIFY_EMAIL="you@yourinbox.com"     # where alerts land
   RESEND_FROM_EMAIL="Verdict Vault <onboarding@resend.dev>"
   ```
4. That's it — you'll get a formatted email per submission with a "Review in
   admin" button.

> The `onboarding@resend.dev` sender works immediately for testing. To send
> from your own domain (e.g. `alerts@verdictvault.com`), verify the domain in
> Resend ▸ Domains and update `RESEND_FROM_EMAIL`. Optional.

Leave `RESEND_API_KEY` empty to skip email — the WhatsApp button below still works.

### 4B. One-tap WhatsApp button (no API at all)

Every submission in **/admin/submissions** has a green **WhatsApp** button. Tap
it and WhatsApp opens (app or web) with your number selected and the submission
details pre-typed — you just hit send. This uses a plain `wa.me` link, so there
is **no token, no provider, no approval, and no cost**.

Set your number so the button targets your chat directly. In `.env.local`:
```bash
# International format, DIGITS ONLY — country code, no + / spaces / dashes.
# +91 98765 43210  ->  919876543210
NEXT_PUBLIC_ADMIN_WHATSAPP="919876543210"
```

If you leave it blank, the button still opens WhatsApp with the message; you
just pick the chat yourself.


---

## Part 5 — Deploy (Vercel, recommended)

1. Push the project to a GitHub repo.
2. <https://vercel.com> → **New Project** → import the repo.
3. **Settings ▸ Environment Variables** → add every line from your `.env.local`
   (client *and* server vars). For `FIREBASE_PRIVATE_KEY`, paste the value with
   its `\n` sequences intact.
4. Deploy. Vercel auto-detects Next.js — no extra config.
5. In `app/layout.tsx` set `siteUrl` to your real domain, and update `BASE` in
   `sitemap.ts`, `robots.ts`, and `feed.xml/route.ts`. Redeploy.

Add your production domain to **Firebase ▸ Authentication ▸ Settings ▸
Authorized domains** so login works in production.

---

## Part 6 — Make it discoverable (SEO go-live)

The site ships SEO-complete (see `SEO.md`). To get indexed:

1. **Google Search Console** → <https://search.google.com/search-console> →
   add your domain → verify (Vercel supports DNS/HTML verification).
2. **Submit your sitemap:** in Search Console, Sitemaps → enter `sitemap.xml`.
   (It's generated automatically at `/sitemap.xml`.)
3. **Check your social preview:** paste your URL into
   <https://www.opengraph.xyz> — you should see the gold "Law Explained.
   Clearly. Confidently." card generated by `app/opengraph-image.tsx`.
4. **Bing** (optional): <https://www.bing.com/webmasters> → submit the same sitemap.

Indexing takes days to a couple of weeks. New published posts appear in your
sitemap automatically.

---

## Part 7 — Performance

This build was tuned for smooth scrolling on mid- and low-end devices. What was
changed and why lives in `PERFORMANCE.md`. The short version: the background no
longer repaints on scroll, ambient glows are static instead of animated, the
cursor effect idles when still and is off on mobile, and phones use fast native
scrolling instead of JS smooth-scroll.

If you ever add heavy effects, keep the rule that caused the original lag in
mind: **never animate the position of a blurred element** — it re-renders the
blur every frame.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `npm audit` shows issues | Already resolved via `overrides`; don't run `audit fix --force` (it downgrades Next.js). |
| Login says "Firebase not configured" | `.env.local` missing/incomplete, or dev server not restarted. |
| Login fails with a valid user | Add your domain to Firebase Authorized domains (Part 5). |
| Submissions don't save | Admin SDK vars (`FIREBASE_*`) missing, or `FIREBASE_PRIVATE_KEY` newlines broken. |
| No email alert | Check `RESEND_API_KEY` and `ADMIN_NOTIFY_EMAIL` are set and the dev server was restarted. |
| WhatsApp button opens no chat | Set `NEXT_PUBLIC_ADMIN_WHATSAPP` (digits only, with country code). |
| Fonts don't load first build | First build needs network for Google Fonts; cached after. |

---

## Part 8 — Firestore-backed content, Storage uploads & admin lockdown

The site now reads **all articles from Firestore** and stores **cover photos in
Firebase Storage**. The public pages show only what you publish from the admin.

### Enable Firebase Storage (for cover uploads)
1. Firebase Console → **Build → Storage → Get started**.
2. Choose a location (same region as Firestore is ideal).
3. Publish the storage rules shipped in `storage.rules`:
   ```bash
   firebase deploy --only storage
   ```
   These let anyone *view* cover images but only signed-in admins *upload* them
   (image files, max 8 MB).
4. Confirm `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is set in `.env.local` (from
   your Firebase web config — usually `your-app.appspot.com`).

### How content flows now
- **Create/publish** a post in `/admin/posts` (with a cover upload) → it's saved
  to the `posts` collection in Firestore, cover URL in Storage.
- Set status to **Published** → it appears on the homepage, `/blog`, its category
  page, and its author's page. Drafts stay hidden.
- Pages use **ISR (30s)** — a published post shows within ~30 seconds, and
  updates propagate the same way, without a redeploy.

### Admin is now locked at the edge
`middleware.ts` blocks every `/admin` route unless you're signed in. Typing
`/admin` while logged out now redirects straight to `/admin/login`. A session
cookie (`vv_session`) is set on login and cleared on logout to drive this.

### Hidden admin entry
There's a small, low-contrast **dot at the far right of the footer** (after
"Editorial Policy"). It links to `/admin/login`. Visitors won't notice it; you
can bookmark it or just click it.

> **Note on seed data:** the sample articles were removed — the site is empty
> until you publish real posts. The practice-area categories and the author
> profiles remain as fixed structural content (managing those from the admin
> would be a later phase).
