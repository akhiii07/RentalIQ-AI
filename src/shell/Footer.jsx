import React from "react";
import { T, FONTS } from "../theme";

export default function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${T.divider}`,
      background: T.paperDark, marginTop: 60,
    }}>
      <div style={{
        width: "min(95%, 2400px)", margin: "0 auto", padding: "26px 0",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: FONTS.sans, fontSize: 13, color: T.ink3,
      }}>
        <div>RentalIQ AI · Prototype MVP · For demonstration only</div>
        <div style={{ display: "flex", gap: 18 }}>
          <span>Privacy-first GPS</span>
          <span>Explainable AI</span>
          <span>Resident-weighted reviews</span>
        </div>
      </div>
    </footer>
  );
}
