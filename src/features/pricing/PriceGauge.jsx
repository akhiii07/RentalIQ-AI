import React from "react";
import { T, FONTS } from "../../theme";
import { Pill } from "../../components/ui";
import { fmtINRk } from "../../utils";

// Range bar with confidence band, AI marker, and listed-asking marker.
export default function PriceGauge({ low, price, high, listed }) {
  const min = Math.min(low, listed) * 0.96;
  const max = Math.max(high, listed) * 1.04;
  const pos = (v) => ((v - min) / (max - min)) * 100;

  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ position: "relative", height: 54 }}>
        <div style={{ position: "absolute", top: 22, left: 0, right: 0, height: 10,
          background: "#E8DFCA", borderRadius: 99 }} />
        <div style={{
          position: "absolute", top: 22, left: `${pos(low)}%`,
          width: `${pos(high) - pos(low)}%`, height: 10,
          background: `linear-gradient(90deg, ${T.emerald2}, ${T.emerald})`,
          borderRadius: 99,
        }} />
        <div style={{ position: "absolute", left: `${pos(price)}%`, top: 8, transform: "translateX(-50%)" }}>
          <div style={{ width: 2, height: 38, background: T.ink }} />
          <div style={{ position: "absolute", top: -22,
            transform: "translateX(-50%)", left: "50%", whiteSpace: "nowrap" }}>
            <Pill tone="ink">AI · {fmtINRk(price)}</Pill>
          </div>
        </div>
        <div style={{ position: "absolute", left: `${pos(listed)}%`, top: 14, transform: "translateX(-50%)" }}>
          <div style={{ width: 2, height: 26, background: T.clay, opacity: 0.85 }} />
          <div style={{ position: "absolute", bottom: -18,
            transform: "translateX(-50%)", left: "50%", whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.clay }}>
              Listed {fmtINRk(listed)}
            </span>
          </div>
        </div>
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between", marginTop: 8,
        fontFamily: FONTS.mono, fontSize: 10, color: T.ink3,
      }}>
        <span>{fmtINRk(low)}</span>
        <span>Fair-rent band</span>
        <span>{fmtINRk(high)}</span>
      </div>
    </div>
  );
}
