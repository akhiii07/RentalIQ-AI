import React from "react";
import {
  CheckCircle2, MapPin, Sparkles, TrendingDown, Users, Clock,
} from "lucide-react";
import { T, FONTS } from "../../theme";

const hashIdx = (s, mod) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h) % mod;
};

function Stat({ icon: Icon, value, label, tone = T.ink }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "4px 0",
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: T.paper, color: tone,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon size={14} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
        <span style={{
          fontFamily: FONTS.mono, fontSize: 14, color: T.ink, fontWeight: 500,
        }}>{value}</span>
        <span style={{
          fontFamily: FONTS.sans, fontSize: 10.5, color: T.ink3,
          textTransform: "uppercase", letterSpacing: 1.2, marginTop: 2,
        }}>{label}</span>
      </div>
    </div>
  );
}

export default function TrustRibbon({ society }) {
  // Synthesise consistent numbers per society so the ribbon reads stable.
  const verified  = 90 + hashIdx(society.id + "v", 160);
  const visitors  = 0.8 + hashIdx(society.id + "x", 28) / 10; // 0.8 – 3.7 k
  const bidConf   = 84 + hashIdx(society.id + "c", 14);       // 84-97 %
  const onMarket  = 4  + hashIdx(society.id + "o", 24);       // 4-27 days
  const trendDrop = 1  + hashIdx(society.id + "t", 7);        // 1-7 %

  return (
    <div style={{
      marginTop: 20,
      background: "#fff", border: `1px solid ${T.divider}`,
      borderRadius: 14, padding: "14px 20px",
      display: "flex", flexWrap: "wrap", gap: 28,
      alignItems: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    }}>
      <Stat icon={CheckCircle2}  tone={T.emerald} value={verified}              label="Verified residents" />
      <Stat icon={MapPin}        tone={T.clay}    value={`${visitors.toFixed(1)}k`} label="GPS-verified visits" />
      <Stat icon={Sparkles}      tone={T.mustard} value={`${bidConf}%`}         label="Bid-clearance · 90d" />
      <Stat icon={Clock}         tone={T.ink2}    value={`${onMarket} days`}     label="Median on market" />
      <Stat icon={TrendingDown}  tone={T.clay}    value={`${trendDrop}%`}        label="Below ask · last 5 bids" />
      <Stat icon={Users}         tone={T.emerald} value="Mixed"                  label="Resident sentiment" />
    </div>
  );
}
