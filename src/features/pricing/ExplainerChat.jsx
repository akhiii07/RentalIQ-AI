import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { T, FONTS } from "../../theme";
import { Card, Pill, Kicker } from "../../components/ui";
import { fmtINR, fmtINRk } from "../../utils";

const PRESETS = [
  "Why is this property priced higher?",
  "What factors reduced the price?",
  "Show me similar apartments",
];

function findDelta(pricing, key) {
  return pricing.factorDeltas.find((d) => d.key === key) || { v: 0, score: 0 };
}

function buildResponses(pricing) {
  const schools = findDelta(pricing, "schools");
  const connect = findDelta(pricing, "connect");
  const noise   = findDelta(pricing, "noise");

  return {
    "Why is this property priced higher?":
      `Three factors lifted this rent above the locality median: connectivity (${connect.score.toFixed(1)}/10) added +${fmtINRk(Math.round(connect.v))}, school access added +${fmtINRk(Math.round(schools.v))}, and the society's maintenance & safety added the rest. Walkability to 100ft Road carries a real premium here.`,
    "What factors reduced the price?":
      `Ambient noise penalty is the biggest dampener at ${fmtINR(Math.round(Math.abs(noise.v)))}. The building's age (8 yrs) also reduces per-sqft pricing slightly vs newer comparables like Purva Skywood.`,
    "Show me similar apartments":
      `The closest matches are Salarpuria Greenage (91% match, 1.8 km away) and Sobha Meadows (88% match in HSR). Both are similarly aged, similarly sized, and share the locality's amenity profile. Use the comparables list below to refine.`,
  };
}

export default function ExplainerChat({ pricing }) {
  const [asked, setAsked] = useState(null);
  const responses = buildResponses(pricing);

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Pill icon={Sparkles}>Explain this price</Pill>
          <div style={{ fontFamily: FONTS.serif, fontSize: 18, color: T.ink, marginTop: 8 }}>
            Ask the engine, in plain English
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        {PRESETS.map((p) => (
          <button key={p} onClick={() => setAsked(p)} style={{
            padding: "8px 12px",
            background: asked === p ? T.ink : T.paper,
            color: asked === p ? T.paper : T.ink2,
            border: `1px solid ${asked === p ? T.ink : T.divider}`,
            borderRadius: 99, cursor: "pointer",
            fontFamily: FONTS.sans, fontSize: 12,
          }}>
            {p}
          </button>
        ))}
      </div>

      {asked && (
        <div style={{
          marginTop: 14, padding: "14px 16px", background: T.paper,
          borderRadius: 10, borderLeft: `3px solid ${T.emerald}`,
        }}>
          <Kicker color={T.emerald}>Engine response</Kicker>
          <div style={{
            fontFamily: FONTS.serif, fontSize: 14.5, color: T.ink, marginTop: 6, lineHeight: 1.55,
          }}>
            {responses[asked]}
          </div>
        </div>
      )}
    </Card>
  );
}
