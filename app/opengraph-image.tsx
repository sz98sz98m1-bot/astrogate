import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Deliberately Latin-only text here: Satori's font-shaping engine does not yet support the
// GSUB lookups Arabic script needs for connected letterforms (verified: it throws
// "lookupType: 5 - substFormat: 3 is not yet supported" and crashes the route when Arabic
// text is included). The og:title/description meta tags already carry the Arabic name --
// this preview image just needs to look correct, not carry the full Arabic branding.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 35%, #171c45 0%, #090b1a 55%, #040612 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 24 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                background: "#ffd166",
                transform: "rotate(45deg)",
                display: "flex",
              }}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 96,
            fontWeight: 900,
            color: "#eef1ff",
            display: "flex",
          }}
        >
          AstroGate
        </div>
        <div style={{ marginTop: 16, fontSize: 34, color: "#a855f7", display: "flex" }}>
          Discover Your Cosmic Blueprint
        </div>
      </div>
    ),
    { ...size },
  );
}
