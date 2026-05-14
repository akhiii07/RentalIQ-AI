import React from "react";
import {
  Wrench, Car, Droplet, Zap, Volume2, Shield, Users, Star,
  Sparkles, Check, AlertCircle,
} from "lucide-react";
import { T, FONTS } from "../../../theme";
import { Card, SectionHeader } from "../../../components/ui";
import FactorTile from "../FactorTile";

const STRENGTHS = [
  "Water & power are not a daily worry",
  "Maintenance team responds same-day",
  "Family culture is active and welcoming",
  "Walkable to 100ft Road cafés and metro",
];

const FRICTIONS = [
  "Second-car parking is waitlisted",
  "Outer-block units catch some road noise",
  "Older lifts get patchy fixes",
  "Rents have outpaced amenity upgrades",
];

function ConsensusList({ items, color, icon: Icon, label }) {
  return (
    <div>
      <div style={{
        fontFamily: FONTS.sans, fontSize: 10,
        textTransform: "uppercase", letterSpacing: 1.4, color, fontWeight: 500,
      }}>
        {label}
      </div>
      {items.map((s, i) => (
        <div key={i} style={{
          display: "flex", gap: 8, marginTop: 8,
          fontFamily: FONTS.serif, fontSize: 14, color: T.ink2, lineHeight: 1.45,
        }}>
          <Icon size={14} color={color} style={{ flexShrink: 0, marginTop: 3 }} />
          {s}
        </div>
      ))}
    </div>
  );
}

export default function OverviewTab({ society }) {
  const tiles = [
    { icon: Wrench,  label: "Maintenance",       value: "Responsive · app-based",   score: society.maintenance,    tone: T.emerald, sub: true },
    { icon: Car,     label: "Parking",           value: society.parking,             score: society.parkingScore,   tone: T.emerald, sub: true },
    { icon: Droplet, label: "Water reliability", value: "Borewell + Cauvery",        score: society.water,          tone: T.emerald, sub: true },
    { icon: Zap,     label: "Power backup",      value: "100% common, 80% homes",    score: society.power,          tone: T.emerald, sub: true },
    { icon: Volume2, label: "Noise (interior)",  value: "Calm past 10 PM",           score: society.noise,          tone: T.clay,    sub: true },
    { icon: Shield,  label: "Safety",            value: "24×7 guards · biometric",   score: society.safety,         tone: T.emerald, sub: true },
    { icon: Users,   label: "Neighborhood",      value: society.sentiment },
    { icon: Star,    label: "Builder rating",    value: "Long-tenure builder",       score: society.builderRating,  tone: T.emerald, sub: true },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {tiles.map((t, i) => <FactorTile key={i} {...t} />)}
      </div>

      <Card padding={20} style={{ marginTop: 24, borderRadius: 14 }}>
        <SectionHeader
          pill="AI synthesis" pillIcon={Sparkles}
          title="What residents consistently agree on"
          right={(
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.ink3 }}>
              Across 198 verified inputs
            </div>
          )}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
          <ConsensusList items={STRENGTHS} color={T.emerald} icon={Check}        label="Strengths" />
          <ConsensusList items={FRICTIONS} color={T.clay}    icon={AlertCircle}  label="Friction points" />
        </div>
      </Card>
    </div>
  );
}
