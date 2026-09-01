import "server-only";
import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function normalizePrivateKey(raw?: string): string | undefined {
  if (!raw) return undefined;
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  key = key.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
  return key;
}

function getAdminApp(): App | null {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (!projectId || !clientEmail || !privateKey) return null;
  if (!privateKey.includes("BEGIN PRIVATE KEY")) {
    console.warn("[firebase-admin] FIREBASE_PRIVATE_KEY doesn't look like a PEM key.");
    return null;
  }
  try {
    if (getApps().length) return getApp();
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
    });
  } catch (err) {
    console.warn("[firebase-admin] init failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

const adminApp = getAdminApp();
export const adminDb: Firestore | null = adminApp ? getFirestore(adminApp) : null;
export const isAdminConfigured = Boolean(adminApp);

export async function uploadBufferToStorage(
  buffer: Buffer, destPath: string, contentType: string
): Promise<string | null> {
  if (!adminApp) return null;
  const bucketName = (
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || ""
  ).replace(/^gs:\/\//, "").trim();
  if (!bucketName) {
    console.error("[firebase-admin] Storage bucket not set in .env.local.");
    return null;
  }
  try {
    const bucket = getStorage(adminApp).bucket(bucketName);
    const file = bucket.file(destPath);
    await file.save(buffer, { contentType, resumable: false });
    await file.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${destPath}`;
  } catch (err) {
    console.error("[firebase-admin] cover upload failed:", err);
    return null;
  }
}
