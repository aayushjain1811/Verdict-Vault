# Deploy to Firebase App Hosting

Your app has server code (API routes, SSR, middleware), so it needs **App
Hosting** — not plain Firebase Hosting. App Hosting builds from a GitHub repo
and runs your Next.js server on Google's infrastructure.

## Prerequisites
- **Blaze (pay-as-you-go) plan** — App Hosting requires it. A small blog stays
  within the free allowances, but a billing account must be attached.
- Your code in a **GitHub repository**.
- The Firebase CLI. To avoid the earlier permission error, run it with `npx`
  (no global install): prefix every command with `npx firebase-tools` instead
  of `firebase`.

## Step 1 — Push to GitHub
```bash
cd ~/verdict-vault
git init
git add .
git commit -m "Verdict Vault"
# create an empty repo on github.com, then:
git remote add origin https://github.com/<you>/verdict-vault.git
git branch -M main
git push -u origin main
```
`.env.local` is gitignored, so your keys are NOT pushed — good.

## Step 2 — Fill in apphosting.yaml
Open `apphosting.yaml` and replace every `REPLACE_WITH_...` with your real
public values (from Firebase Console → Project Settings → Your apps → SDK
config, plus your live URL and WhatsApp digits). These are the public
`NEXT_PUBLIC_*` values — safe to commit.

## Step 3 — Store the secrets (never commit these)
The private key, Resend key, etc. go in Cloud Secret Manager, referenced by
name in apphosting.yaml. Create each:
```bash
npx firebase-tools apphosting:secrets:set FIREBASE_CLIENT_EMAIL
npx firebase-tools apphosting:secrets:set FIREBASE_PRIVATE_KEY
npx firebase-tools apphosting:secrets:set RESEND_API_KEY
npx firebase-tools apphosting:secrets:set ADMIN_NOTIFY_EMAIL
```
Each prompts you to paste the value. For `FIREBASE_PRIVATE_KEY`, paste the full
key including the BEGIN/END lines.

## Step 4 — Create the backend
```bash
npx firebase-tools apphosting:backends:create --project verdict-vault-30a1e
```
Follow the prompts: pick a region, connect your GitHub repo, choose the `main`
branch. Firebase builds and deploys automatically.

## Step 5 — Grant the backend access to each secret
```bash
npx firebase-tools apphosting:secrets:grantaccess FIREBASE_CLIENT_EMAIL --backend <backend-id>
npx firebase-tools apphosting:secrets:grantaccess FIREBASE_PRIVATE_KEY --backend <backend-id>
npx firebase-tools apphosting:secrets:grantaccess RESEND_API_KEY --backend <backend-id>
npx firebase-tools apphosting:secrets:grantaccess ADMIN_NOTIFY_EMAIL --backend <backend-id>
```
(`<backend-id>` is shown when the backend is created.)

## Step 6 — Add your live domain to Firebase Auth
Firebase Console → Authentication → Settings → **Authorized domains** → add the
App Hosting URL (and your custom domain if you set one). Otherwise admin login
fails in production.

## Deploys after this
Every `git push` to `main` triggers a new build and rollout automatically. You
can watch it in Firebase Console → App Hosting → your backend → Rollouts.

## If a page 500s in production
- Missing/una­uthorised secret → re-run the `grantaccess` command for it.
- Storage upload fails → confirm `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` in
  apphosting.yaml matches your real bucket.
- Login fails → authorized domains (Step 6).