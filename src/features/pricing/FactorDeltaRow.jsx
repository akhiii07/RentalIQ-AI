import React from "react";
import { T, FONTS } from "../../theme";
import { fmtINR } from "../../utils";
import { FACTOR_ICONS } from "./factorIcons";

// A divergent +/- bar centered on 0. Each row shows how one factor pushed
// the rent above or below the comparables base.
export default function FactorDeltaRow({ d, base }) {
  const pct = (d.v / base) * 100;
  const positive = d.v >= 0;
  const Icon = FACTOR_ICONS[d.key];

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "22px 1fr 110px 80px",
      alignItems: "center", gap: 10, padding: "9px 0",
      borderBottom: `1px dashed ${T.divider}`,
    }}>
      {Icon && <Icon size={14} color={T.ink3} strokeWidth={1.6} />}
      <div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, color: T.ink }}>
          {d.k}
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 10.5, color: T.ink3, marginTop: 1 }}>
          Locality score: {d.score.toFixed(1)} / 10
        </div>
      </div>
      <div style={{ position: "relative", height: 8, background: "#E8DFCA", borderRadius: 99 }}>
        <div style={{
          position: "absolute", left: "50%", top: 0, bottom: 0,
          width: `${Math.min(Math.abs(pct) * 4, 50)}%`,
          transform: positive ? "translateX(0)" : "translateX(-100%)",
          background: positive ? T.emerald : T.clay, borderRadius: 99,
          transition: "all 350ms",
        }} />
        <div style={{
          position: "absolute", left: "50%", top: -2, bottom: -2,
          width: 1, background: T.ink2, opacity: 0.4,
        }} />
      </div>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 12,
        color: positive ? T.emerald : T.clay, textAlign: "right", fontWeight: 500,
      }}>
        {positive ? "+" : ""}{fmtINR(Math.round(d.v))}
      </div>
    </div>
  );
}
