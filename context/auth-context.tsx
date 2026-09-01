"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";

interface AuthState {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      try {
        if (u) {
          const idToken = await u.getIdToken();
          await fetch("/api/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });
        } else {
          await fetch("/api/session", { method: "DELETE" });
        }
      } catch {
        /* cookie sync is best-effort */
      }
    });
    return () => unsub();
  }, []);

  async function signIn(email: string, password: string) {
    if (!auth) throw new Error("Firebase is not configured. See README.");
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signOut() {
    try {
      await fetch("/api/session", { method: "DELETE" });
    } catch {
      /* ignore */
    }
    if (!auth) return;
    await fbSignOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, configured: isFirebaseConfigured, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
