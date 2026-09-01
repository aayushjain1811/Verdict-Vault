"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { addSubscriber } from "@/lib/firebase/firestore";
import { isFirebaseConfigured } from "@/lib/firebase/client";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function subscribe() {
    if (!email.includes("@")) return;
    try {
      if (isFirebaseConfigured) await addSubscriber(email);
    } catch (e) {
      console.error("Subscribe failed:", e);
    }
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <div
      id="newsletter"
      className="glass relative overflow-hidden rounded-3xl px-8 py-14 text-center md:px-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-vault-radial" />
      <div className="relative">
        <p className="eyebrow">The Brief</p>
        <h2 className="mx-auto mt-4 max-w-xl text-3xl leading-tight text-bone md:text-4xl">
          Legal clarity, delivered every week.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-smoke">
          Join thousands of professionals who start their week with our
          essential reading. No noise. No spam. Just the law, explained.
        </p>

        <div className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-gold/20 bg-ink/60 p-1.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && subscribe()}
            placeholder="you@example.com"
            className="w-full bg-transparent px-4 py-2 text-sm text-bone outline-none placeholder:text-smoke"
          />
          <button
            onClick={subscribe}
            className="flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-[1.02]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.span
                  key="ok"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" /> Subscribed
                </motion.span>
              ) : (
                <motion.span
                  key="go"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5"
                >
                  Subscribe <ArrowRight className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </div>
  );
}
