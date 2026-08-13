import { ImageResponse } from "next/og";

export const alt = "dev.notes — Ghi chép về lập trình và hệ thống";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          color: "#f4eee3",
          background: "linear-gradient(135deg, #122827 0%, #101116 58%, #382c18 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: 28 }}>
          <span style={{ color: "#d6b75c" }}>dn.</span>
          <span>dev.notes</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "940px" }}>
          <div style={{ color: "#d6b75c", fontSize: 24, letterSpacing: "0.12em", textTransform: "uppercase" }}>Technical field notes</div>
          <div style={{ fontSize: 72, lineHeight: 1.05, letterSpacing: "-0.04em" }}>Ghi chép về lập trình và hệ thống.</div>
        </div>
        <div style={{ color: "#b9b0a3", fontSize: 25 }}>Distributed systems · Databases · Software engineering</div>
      </div>
    ),
    size,
  );
}
