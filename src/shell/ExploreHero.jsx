import React from "react";
import { X } from "lucide-react";
import { T, FONTS } from "../theme";
import { Card, Kicker } from "../components/ui";

const NOT_THIS = [
  "A listing aggregator with filters",
  "A pricing calculator with two inputs",
  "Yet another star-rating review pile",
];

// Title block + "three things this isn't" card shown above the map.
export default function ExploreHero() {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 320px",
      gap: 30, alignItems: "end", marginBottom: 24,
    }}>
      <div>
        <Kicker color={T.clay} tracking={1.6} size={11}>Bengaluru · May 2026</Kicker>
        <h1 style={{
          fontFamily: FONTS.serif, fontSize: 54, fontWeight: 400,
          color: T.ink, margin: "6px 0 0", letterSpacing: -1, lineHeight: 1.02,
        }}>
          Read the city <em style={{ color: T.clay }}>before</em><br />
          you sign the lease.
        </h1>
        <p style={{
          fontFamily: FONTS.serif, fontSize: 16, color: T.ink2,
          marginTop: 14, maxWidth: 540, lineHeight: 1.55, fontStyle: "italic",
        }}>
          Locality intelligence, verified neighbor voices, and an AI engine
          that prices each home on the things brokers don't quantify —
          school access, road noise, parking, and how the society actually feels.
        </p>
      </div>

      <Card padding={16}>
        <Kicker>Three things this isn't</Kicker>
        {NOT_THIS.map((t) => (
          <div key={t} style={{
            display: "flex", gap: 8, marginTop: 8,
            fontFamily: FONTS.serif, fontSize: 13, color: T.ink2, fontStyle: "italic",
          }}>
            <X size={14} color={T.clay} strokeWidth={2} style={{ flexShrink: 0, marginTop: 3 }} />
            {t}
          </div>
        ))}
      </Card>
    </div>
  );
}
