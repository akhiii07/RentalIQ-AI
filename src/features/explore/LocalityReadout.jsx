import React from "react";
import {
  Shield, Volume2, GraduationCap, ShoppingBag, Train, ChevronRight,
} from "lucide-react";
import { T, FONTS } from "../../theme";
import { Card, Pill, Stat, Divider, Kicker, ScoreFactorList } from "../../components/ui";
import { fmtINR } from "../../utils";

const demandTone = (demand) =>
  demand === "Very High" ? "clay" : demand === "High" ? "mustard" : "emerald";

export default function LocalityReadout({ locality, hovering, drilledIn, onDrillIn }) {
  const rows = [
    { k: "Safety",                v: locality.safety,  icon: Shield },
    { k: "Connectivity",          v: locality.connect, icon: Train },
    { k: "Schools",               v: locality.schools, icon: GraduationCap },
    { k: "Amenities",             v: locality.amenity, icon: ShoppingBag },
    { k: "Noise (lower=quieter)", v: locality.noise,   icon: Volume2, inverted: true },
  ];

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <Kicker>Locality Read · {hovering ? "Hover" : "Default"}</Kicker>
          <div style={{
            fontFamily: FONTS.serif, fontSize: 32, fontWeight: 400,
            color: T.ink, marginTop: 3, lineHeight: 1.1,
          }}>
            {locality.name}
          </div>
        </div>
        <Pill tone={demandTone(locality.demand)}>{locality.demand}</Pill>
      </div>

      <div style={{
        fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 14.5,
        color: T.ink3, marginTop: 8, lineHeight: 1.5,
      }}>
        "{locality.blurb}"
      </div>

      <Divider />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        <Stat label="Avg 3BHK rent" value={fmtINR(locality.avgRent)}
              sub={`${locality.trend > 0 ? "↑" : "↓"} ${Math.abs(locality.trend)}% YoY`} />
        <Stat label="Locality score" value={`${locality.score} / 10`} sub="Weighted index" />
      </div>

      <div style={{ marginTop: 10 }}>
        <ScoreFactorList rows={rows} />
      </div>

      <button onClick={() => onDrillIn(drilledIn ? null : locality.id)} style={{
        marginTop: 12, width: "100%", padding: "11px 14px", border: "none",
        background: T.ink, color: T.paper, borderRadius: 10, cursor: "pointer",
        fontFamily: FONTS.sans, fontSize: 13, fontWeight: 500,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
      }}>
        {drilledIn ? `Back to all localities` : `View listings in ${locality.name}`}
        <ChevronRight size={15} strokeWidth={2} />
      </button>
    </Card>
  );
}
