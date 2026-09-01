import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Write for Verdict Vault",
  description:
    "Submit a legal article for review. Every piece is read by an editor before publication.",
  alternates: { canonical: "/write" },
  openGraph: {
    title: "Write for Verdict Vault",
    description: "Have a legal insight worth sharing? Submit it for review.",
    url: "/write",
    type: "website",
  },
};

export default function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
