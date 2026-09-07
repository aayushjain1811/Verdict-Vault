import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteChrome } from "@/components/site-chrome";
import { SplashScreen } from "@/components/splash-screen";
import { AuthProvider } from "@/context/auth-context";

// Bodoni Moda — hairline-contrast luxury display, the voice of the brand.
const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal", "italic"],
});

// Newsreader — an editorial serif built for long-form reading.
const read = Newsreader({
  subsets: ["latin"],
  variable: "--font-read",
  display: "swap",
  style: ["normal", "italic"],
});

// IBM Plex Mono — docket numbers, labels, metadata. Court-filing vernacular.
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://verdictvault.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Verdict Vault — Where Law Meets Clarity",
    template: "%s · Verdict Vault",
  },
  description:
    "A premium legal knowledge platform. Rigorous analysis, landmark cases, and practical guidance — written with clarity and precision.",
  applicationName: "Verdict Vault",
  authors: [{ name: "Verdict Vault" }],
  creator: "Verdict Vault",
  publisher: "Verdict Vault",
  category: "Law",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
  keywords: [
    "legal analysis",
    "law blog",
    "corporate law",
    "criminal law",
    "constitutional law",
    "legal knowledge",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Verdict Vault — Where Law Meets Clarity",
    description:
      "A premium legal knowledge platform. The law, explained clearly and confidently.",
    siteName: "Verdict Vault",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verdict Vault — Where Law Meets Clarity",
    description: "The law, explained clearly and confidently.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${read.variable} ${mono.variable}`}>
      <body className="grain min-h-screen antialiased">
        <AuthProvider>
          <SplashScreen />
          <SmoothScroll>
            <SiteChrome>{children}</SiteChrome>
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}