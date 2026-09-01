"use client";

import { MessageCircle } from "lucide-react";

/**
 * "Send to WhatsApp" — a plain wa.me deep link. No API, no token, no provider.
 *
 * Generic: pass the target `phone` (digits, country code, no +/spaces — the
 * component strips non-digits) and the `message` to pre-fill. Used two ways:
 *   - Forward a submission to your own number (phone = your admin number)
 *   - Message the writer after approval (phone = the writer's number)
 * If no phone is given, WhatsApp opens with the message and you pick the chat.
 */
export function WhatsAppLink({
  phone,
  message,
  label = "WhatsApp",
  className,
}: {
  phone?: string;
  message: string;
  label?: string;
  className?: string;
}) {
  const number = (phone || "").replace(/\D/g, "");
  const href = number
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
      }
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </a>
  );
}