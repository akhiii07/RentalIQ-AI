import React from "react";
import { Crosshair, Lock } from "lucide-react";
import { T, FONTS } from "../../theme";

// Animated GPS ping. The riq-ping keyframes live in shell/GlobalStyles.
export default function LocateStep() {
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto" }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: `2px solid ${T.emerald}`,
          animation: "riq-ping 1.6s ease-out infinite",
        }} />
        <div style={{
          position: "absolute", inset: 20, borderRadius: "50%",
          border: `2px solid ${T.emerald}`, opacity: 0.6,
          animation: "riq-ping 1.6s ease-out 0.4s infinite",
        }} />
        <div style={{
          position: "absolute", inset: 50, borderRadius: "50%",
          background: T.emerald, display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <Crosshair size={20} color={T.paper} />
        </div>
      </div>
      <div style={{ fontFamily: FONTS.serif, fontSize: 20, color: T.ink, marginTop: 18 }}>
        Verifying your location…
      </div>
      <div style={{
        fontFamily: FONTS.sans, fontSize: 12, color: T.ink3,
        marginTop: 6, maxWidth: 380, margin: "6px auto 0", lineHeight: 1.5,
      }}>
        We confirm you're within 50 m of the property. Your raw coordinates
        are discarded — only the verification badge is kept.
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
        marginTop: 14, fontFamily: FONTS.sans, fontSize: 11, color: T.ink3,
      }}>
        <Lock size={11} /> Privacy mode · explicit consent · auto-purge
      </div>
    </div>
  );
}
