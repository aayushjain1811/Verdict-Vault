"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send, PenLine, ImagePlus } from "lucide-react";
import { categories } from "@/lib/data";
import { countries, defaultCountry, validateNationalNumber, type Country } from "@/lib/countries";

export default function WritePage() {
  const [form, setForm] = useState({
    title: "",
    authorName: "",
    authorEmail: "",
    categorySlug: categories[0].slug,
    content: "",
    website: "",
  });
  const [country, setCountry] = useState<Country>(defaultCountry);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const words = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function markTouched(field: string) {
    setTouched((t) => ({ ...t, [field]: true }));
  }
  function onPhone(v: string) {
    setPhone(v.replace(/\D/g, "").slice(0, country.max));
  }
  function onCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setTouched((t) => ({ ...t, cover: true }));
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCoverFile(null);
      setCoverPreview("");
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  const errors = {
    authorName: form.authorName.trim() ? "" : "Please add your name.",
    authorEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.authorEmail)
      ? ""
      : "Enter a valid email address.",
    phone: validateNationalNumber(country, phone),
    title: form.title.trim().length >= 4 ? "" : "Title must be at least 4 characters.",
    content:
      form.content.trim().length >= 200
        ? ""
        : `Write at least a few paragraphs (${form.content.trim().length}/200 characters).`,
    cover: coverFile ? "" : "Please attach a cover image.",
  };
  const isValid = Object.values(errors).every((e) => !e);

  function show(field: keyof typeof errors) {
    return touched[field] && errors[field] ? errors[field] : "";
  }

  async function submit() {
    setTouched({ authorName: true, authorEmail: true, phone: true, title: true, content: true, cover: true });
    if (!isValid) {
      setError("Please fix the highlighted fields.");
      setStatus("error");
      return;
    }
    setError("");
    setStatus("sending");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("authorName", form.authorName);
      fd.append("authorEmail", form.authorEmail);
      fd.append("authorPhone", `+${country.dial}${phone}`);
      fd.append("categorySlug", form.categorySlug);
      fd.append("content", form.content);
      fd.append("website", form.website);
      if (coverFile) fd.append("cover", coverFile);

      const res = await fetch("/api/submit-post", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="pt-40">
      <header className="shell max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-gold/50" />
          <span className="eyebrow">Contribute</span>
        </div>
        <h1 className="display text-4xl text-bone md:text-6xl">
          Write for <span className="italic text-gold-gradient">the vault.</span>
        </h1>
        <p className="mt-6 max-w-xl font-read text-lg leading-relaxed text-smoke">
          Have a legal insight worth sharing? Submit it here. Every piece is read
          by an editor before publication — you’ll hear back once it’s reviewed.
        </p>
      </header>

      <div className="shell mt-14 max-w-3xl pb-16">
        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass flex flex-col items-center rounded-3xl p-14 text-center"
            >
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15 }}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold"
              >
                <Check className="h-7 w-7" />
              </motion.span>
              <h2 className="mt-6 font-display text-3xl text-bone">Submission received</h2>
              <p className="mt-3 max-w-md font-read text-smoke">
                Thank you. An editor has been notified and will review your piece.
                If it’s a fit, it’ll appear on Verdict Vault under your name.
              </p>
              <Link
                href="/"
                className="mt-8 rounded-full border border-gold/25 px-6 py-2.5 text-sm text-bone transition-colors hover:border-gold/50"
              >
                Back to home
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-3xl p-8 md:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your name" error={show("authorName")}>
                  <input
                    value={form.authorName}
                    onChange={(e) => update("authorName", e.target.value)}
                    onBlur={() => markTouched("authorName")}
                    className="write-input"
                    placeholder="Jordan Ellis"
                  />
                </Field>
                <Field label="Your email" error={show("authorEmail")}>
                  <input
                    type="email"
                    value={form.authorEmail}
                    onChange={(e) => update("authorEmail", e.target.value)}
                    onBlur={() => markTouched("authorEmail")}
                    className="write-input"
                    placeholder="you@example.com"
                  />
                </Field>
              </div>

              <div className="mt-5">
                <Field label="WhatsApp number" error={show("phone")}>
                  <div className="flex gap-2">
                    <select
                      value={country.code}
                      onChange={(e) => {
                        const c = countries.find((x) => x.code === e.target.value)!;
                        setCountry(c);
                        setPhone((p) => p.slice(0, c.max));
                      }}
                      className="write-input w-[132px] shrink-0"
                      aria-label="Country"
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.code} className="bg-charcoal">
                          {c.flag} +{c.dial}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => onPhone(e.target.value)}
                      onBlur={() => markTouched("phone")}
                      onKeyDown={(e) => {
                        const ok =
                          /[0-9]/.test(e.key) ||
                          ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key) ||
                          e.ctrlKey || e.metaKey;
                        if (!ok) e.preventDefault();
                      }}
                      className="write-input flex-1"
                      placeholder={country.min === country.max ? `${country.min} digits` : `${country.min}-${country.max} digits`}
                    />
                  </div>
                </Field>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-[2fr_1fr]">
                <Field label="Article title" error={show("title")}>
                  <input
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    onBlur={() => markTouched("title")}
                    className="write-input"
                    placeholder="What the law really says about…"
                  />
                </Field>
                <Field label="Category">
                  <select
                    value={form.categorySlug}
                    onChange={(e) => update("categorySlug", e.target.value)}
                    className="write-input"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug} className="bg-charcoal">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-eyebrow text-gold/60">
                    Your article
                  </label>
                  <span className="text-[11px] text-ash">
                    {words} words · ~{Math.max(1, Math.round(words / 200))} min read
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={form.content}
                  onChange={(e) => update("content", e.target.value)}
                  onBlur={() => markTouched("content")}
                  className="write-input resize-none font-read leading-relaxed"
                  placeholder="Write your piece here. Leave a blank line between paragraphs."
                />
                {show("content") && <p className="mt-1.5 text-xs text-rose-300">{show("content")}</p>}
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-[11px] uppercase tracking-eyebrow text-gold/60">
                  Cover image (required)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-xl border border-gold/15 bg-ink/60">
                    {coverPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gold/30">
                        <ImagePlus className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gold/25 px-4 py-2 text-sm text-bone transition-colors hover:border-gold/50">
                    <ImagePlus className="h-4 w-4" />
                    {coverFile ? "Replace image" : "Upload image"}
                    <input type="file" accept="image/*" onChange={onCover} className="hidden" />
                  </label>
                </div>
                {show("cover") && <p className="mt-1.5 text-xs text-rose-300">{show("cover")}</p>}
              </div>

              <input
                type="text" tabIndex={-1} autoComplete="off"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                className="absolute left-[-9999px]" aria-hidden
              />

              {status === "error" && error && (
                <p className="mt-4 text-sm text-rose-300">{error}</p>
              )}

              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={submit}
                  disabled={status === "sending"}
                  className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-7 py-3 text-sm font-medium text-ink transition-all hover:brightness-110 disabled:opacity-60"
                >
                  {status === "sending" ? "Submitting…" : "Submit for review"}
                  <Send className="h-4 w-4" />
                </button>
                <p className="flex items-center gap-1.5 text-xs text-ash">
                  <PenLine className="h-3.5 w-3.5" /> Reviewed before publishing
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .write-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(201, 161, 90, 0.15);
          background: rgba(8, 8, 10, 0.6);
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          color: #f2efe8;
          outline: none;
          transition: border-color 0.2s;
        }
        .write-input:focus { border-color: rgba(201, 161, 90, 0.5); }
        .write-input::placeholder { color: #5a5a61; }
      `}</style>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] uppercase tracking-eyebrow text-gold/60">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-rose-300">{error}</p>}
    </div>
  );
}