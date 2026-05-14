import React, { useState } from "react";
import { Send } from "lucide-react";
import { T, FONTS } from "../../theme";
import { Card, Pill } from "../../components/ui";
import { fmtINR } from "../../utils";

function verdictFor(bid, pricing) {
  if (bid < pricing.low) {
    return { tone: "clay",    t: "Below fair-rent band — owner likely declines" };
  }
  if (bid <= pricing.high) {
    return { tone: "emerald", t: "Within fair-rent band — competitive bid" };
  }
  return     { tone: "mustard", t: "Above fair band — likely accepted, possibly overpaying" };
}

const VERDICT_STYLES = {
  emerald: { bg: "#E2EDDE", fg: T.emerald },
  clay:    { bg: "#F3DCC4", fg: T.clay2 },
  mustard: { bg: "#F4E5BC", fg: "#7A5D14" },
};

export default function BidPanel({ pricing, onBidPlaced }) {
  const [bid, setBid] = useState(pricing.price - 1500);
  const delta = ((bid - pricing.price) / pricing.price) * 100;
  const verdict = verdictFor(bid, pricing);
  const vs = VERDICT_STYLES[verdict.tone];

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Pill>Place a rental bid</Pill>
          <div style={{ fontFamily: FONTS.serif, fontSize: 18, color: T.ink, marginTop: 8 }}>
            What would you pay?
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 26, color: T.ink, fontWeight: 500 }}>
            {fmtINR(bid)}
          </div>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 11,
            color: delta < 0 ? T.emerald : T.clay, marginTop: 2,
          }}>
            {delta > 0 ? "+" : ""}{delta.toFixed(1)}% vs AI fair rent
          </div>
        </div>
      </div>

      <input type="range"
             min={pricing.low - 3000} max={pricing.high + 3000} step={500}
             value={bid} onChange={(e) => setBid(parseInt(e.target.value, 10))}
             style={{ width: "100%", marginTop: 14, accentColor: T.emerald }} />

      <div style={{
        marginTop: 14, padding: "10px 14px",
        background: vs.bg, borderRadius: 10,
        fontFamily: FONTS.serif, fontSize: 13.5,
        color: vs.fg, fontStyle: "italic",
      }}>
        {verdict.t}
      </div>

      <button onClick={() => onBidPlaced(bid)} style={{
        marginTop: 14, width: "100%", padding: "12px 14px", background: T.ink,
        color: T.paper, border: "none", borderRadius: 10, cursor: "pointer",
        fontFamily: FONTS.sans, fontSize: 13, fontWeight: 500,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
      }}>
        <Send size={14} /> Submit bid · feeds market signal back into AI
      </button>

      <div style={{
        marginTop: 10, fontFamily: FONTS.sans, fontSize: 10.5,
        color: T.ink3, lineHeight: 1.5,
      }}>
        Your bid and 412 others on this society train the pricing engine.
        Owners see aggregated demand, not individual identities.
      </div>
    </Card>
  );
}
