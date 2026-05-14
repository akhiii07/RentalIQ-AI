import React from "react";
import { T, FONTS } from "../../theme";

export default function HeatLegend() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{
        fontFamily: FONTS.sans, fontSize: 10,
        textTransform: "uppercase", letterSpacing: 1.4, color: T.ink3,
      }}>
        Avg rent
      </span>
      <div style={{ display: "flex", gap: 2 }}>
        {T.heat.map((c, i) => (
          <div key={i} style={{ width: 18, height: 8, background: c, borderRadius: 2 }} />
        ))}
      </div>
      <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.ink2 }}>
        ₹22K → ₹48K
      </span>
    </div>
  );
}
