import { getPublishedArticles } from "@/lib/posts-server";

const BASE = "https://verdictvault.example";

export const revalidate = 60;

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      default: return "&quot;";
    }
  });
}

export async function GET() {
  const articles = await getPublishedArticles();
  const items = articles
    .map((a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${BASE}/blog/${a.slug}</link>
      <guid isPermaLink="true">${BASE}/blog/${a.slug}</guid>
      <description>${escapeXml(a.excerpt)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(a.authorName ?? "Verdict Vault")}</dc:creator>
    </item>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Verdict Vault</title>
    <link>${BASE}</link>
    <description>Where Law Meets Clarity — rigorous, accessible legal analysis.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
