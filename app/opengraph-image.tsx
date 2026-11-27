import { ImageResponse } from "next/og";
import { restaurant } from "@/config/restaurant";

export const alt = "Four Seasons Restaurant — Chinese food & takeout in Grants Pass, Oregon";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#FFF2DB", padding: 28 }}>
        <div style={{ flex: 1, display: "flex", border: "4px solid #B82025" }}>
          <div style={{ width: 640, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 56px" }}>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 4, color: "#246B54" }}>GRANTS PASS, OREGON</div>
            <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1, color: "#B82025", marginTop: 24, fontFamily: "serif" }}>Four Seasons.</div>
            <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1, color: "#24211D", fontStyle: "italic", fontFamily: "serif" }}>Endless Flavor.</div>
            <div style={{ fontSize: 30, color: "#5A5148", marginTop: 28 }}>
              {`${restaurant.address.street} · ${restaurant.phone.display}`}
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#B82025" }}>
            <div style={{ width: 300, height: 300, borderRadius: 150, background: "#FFF2DB", display: "flex", alignItems: "center", justifyContent: "center", border: "10px solid #E8B64B" }}>
              <div style={{ fontSize: 120, fontWeight: 700, color: "#B82025", fontFamily: "serif" }}>4S</div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
