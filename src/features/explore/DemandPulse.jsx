import React from "react";
import { Sparkles, ArrowUp, ArrowDown } from "lucide-react";
import { T, FONTS } from "../../theme";
import { Card, Pill, Kicker } from "../../components/ui";
import { LOCALITIES } from "../../data";
import { fmtINRk } from "../../utils";

export default function DemandPulse({ onSelect, limit = 5 }) {
  const ranked = [...LOCALITIES].sort((a, b) => b.trend - a.trend).slice(0, limit);
  return (
    <Card padding={16}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Kicker>Demand pulse · last 30d</Kicker>
        <Pill icon={Sparkles}>AI ranked</Pill>
      </div>
      <div style={{ marginTop: 10 }}>
        {ranked.map((l, i) => (
          <div key={l.id} onClick={() => onSelect(l.id)} style={{
            display: "grid", gridTemplateColumns: "18px 1fr auto auto",
            alignItems: "center", gap: 10, padding: "7px 0",
            borderBottom: i < ranked.length - 1 ? `1px dashed ${T.divider}` : "none",
            cursor: "pointer",
          }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.ink4 }}>
              0{i + 1}
            </span>
            <span style={{ fontFamily: FONTS.serif, fontSize: 14, color: T.ink }}>
              {l.name}
            </span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: T.ink2 }}>
              {fmtINRk(l.avgRent)}
            </span>
            <span style={{
              fontFamily: FONTS.mono, fontSize: 11,
              color: l.trend > 5 ? T.clay : T.emerald,
              display: "inline-flex", alignItems: "center", gap: 2,
              width: 42, justifyContent: "flex-end",
            }}>
              {l.trend > 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
              {Math.abs(l.trend).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
