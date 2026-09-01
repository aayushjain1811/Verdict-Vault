import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Verdict Vault — Where Law Meets Clarity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #0c0c10 0%, #0a0a0c 55%, #08080a 100%)",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              border: "1px solid rgba(201,161,90,.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#C9A15A",
              fontSize: 28,
            }}
          >
            ⚖
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 8,
              color: "#C9A15A",
              textTransform: "uppercase",
            }}
          >
            Verdict Vault
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 78, color: "#F2EFE8", lineHeight: 1.05 }}>
            Law Explained.
          </div>
          <div style={{ fontSize: 78, color: "#C9A15A", lineHeight: 1.05 }}>
            Clearly. Confidently.
          </div>
        </div>

        <div style={{ fontSize: 26, color: "#86868C" }}>
          A premium legal knowledge platform
        </div>
      </div>
    ),
    { ...size }
  );
}
