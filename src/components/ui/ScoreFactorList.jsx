import React from "react";
import { T, FONTS } from "../../theme";
import ScoreBar from "./ScoreBar";

// Row config: { k: label, v: 0-10, icon: LucideIcon, inverted?: boolean }
// Renders icon · label · bar · numeric score. Inverted rows tint clay (lower=better).
export default function ScoreFactorList({ rows, dense = false }) {
  const labelSize = dense ? 11.5 : 12;
  const iconSize = dense ? 12 : 14;
  const scoreWidth = dense ? 32 : 36;
  const barColumn = dense ? 60 : 80;
  const iconColumn = dense ? 18 : 22;
  const padY = dense ? 4 : 6;

  return (
    <div>
      {rows.map((r) => {
        const Icon = r.icon;
        return (
          <div key={r.k} style={{
            display: "grid",
            gridTemplateColumns: `${iconColumn}px 1fr ${barColumn}px ${scoreWidth}px`,
            alignItems: "center", gap: dense ? 8 : 10, padding: `${padY}px 0`,
          }}>
            <Icon size={iconSize} color={T.ink3} strokeWidth={1.6} />
            <span style={{ fontFamily: FONTS.sans, fontSize: labelSize, color: T.ink2 }}>
              {r.k}
            </span>
            <ScoreBar score={r.v} color={r.inverted ? T.clay : T.emerald} />
            <span style={{
              fontFamily: FONTS.mono, fontSize: dense ? 10 : 11,
              color: T.ink, textAlign: "right",
            }}>
              {r.v.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
