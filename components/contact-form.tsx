"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Send } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function update(field: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function submit() {
    if (!values.name.trim()) {
      setError("Add your name so we know who we're replying to.");
      setStatus("error");
      return;
    }
    if (!values.email.includes("@")) {
      setError("Enter an email address we can reach you at.");
      setStatus("error");
      return;
    }
    if (values.message.trim().length < 10) {
      setError("Tell us a little more — at least a sentence.");
      setStatus("error");
      return;
    }

    setError("");
    setStatus("sending");

    // Replace with a server action or API route when the backend is connected.
    setTimeout(() => {
      setStatus("sent");
      setValues({ name: "", email: "", subject: "", message: "" });
    }, 900);
  }

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-8 md:p-10">
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold"
            >
              <Check className="h-7 w-7" />
            </motion.span>
            <h3 className="mt-6 font-display text-2xl text-bone">
              Message received
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-smoke">
              An editor will read this and reply within two business days.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-8 text-sm text-gold transition-colors hover:text-gold-pale"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Name"
                value={values.name}
                onChange={(v) => update("name", v)}
                placeholder="Your full name"
              />
              <Field
                label="Email"
                type="email"
                value={values.email}
                onChange={(v) => update("email", v)}
                placeholder="you@example.com"
              />
            </div>
            <Field
              label="Subject"
              value={values.subject}
              onChange={(v) => update("subject", v)}
              placeholder="What is this regarding?"
            />
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-eyebrow text-gold/60">
                Message
              </label>
              <textarea
                rows={5}
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Tell us what you need."
                className="w-full resize-none rounded-xl border border-gold/15 bg-ink/60 px-4 py-3 text-sm text-bone outline-none transition-colors placeholder:text-smoke focus:border-gold/50"
              />
            </div>

            {status === "error" && error && (
              <p className="text-sm text-gold-pale">{error}</p>
            )}

            <button
              onClick={submit}
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-7 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send message"}
              <Send className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] uppercase tracking-eyebrow text-gold/60">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gold/15 bg-ink/60 px-4 py-3 text-sm text-bone outline-none transition-colors placeholder:text-smoke focus:border-gold/50"
      />
    </div>
  );
}
