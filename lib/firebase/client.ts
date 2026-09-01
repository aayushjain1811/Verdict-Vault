import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/**
 * Client-side Firebase. Uses NEXT_PUBLIC_* env vars (safe to expose — these
 * identify your project; security is enforced by Firestore rules, not secrecy).
 *
 * If env vars are absent the app still runs on the seed data in lib/data.ts,
 * so the site never hard-crashes just because Firebase isn't wired yet.
 */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId);

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;
let storageInstance: FirebaseStorage | undefined;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(config);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
  storageInstance = getStorage(app);
}

export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;
export { app };
