import React from "react";
import { MapPin, Building2, Sparkles } from "lucide-react";
import { T, FONTS } from "../../theme";
import { Pill, Kicker, Breadcrumb } from "../../components/ui";
import { fmtINRk } from "../../utils";

export default function SocietyHeader({ society, locality, onBack, onPricing }) {
  return (
    <>
      <Breadcrumb items={[
        { label: "Atlas",        onClick: onBack },
        { label: locality.name },
        { label: society.name },
      ]} />

      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-end", marginTop: 12, gap: 20,
      }}>
        <div>
          <Pill tone="default">Society profile</Pill>
          <h1 style={{
            fontFamily: FONTS.serif, fontSize: 44, fontWeight: 400,
            color: T.ink, margin: "6px 0 4px", letterSpacing: -0.5, lineHeight: 1.05,
          }}>
            {society.name}
          </h1>
          <div style={{
            display: "flex", gap: 14, alignItems: "center",
            fontFamily: FONTS.sans, fontSize: 13, color: T.ink2,
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <MapPin size={13} /> {locality.name}, Bengaluru
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Building2 size={13} /> {society.units} units · {society.age} yrs
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            {society.tags.map((t) => <Pill key={t}>{t}</Pill>)}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <Kicker>3BHK rent band</Kicker>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 24,
            color: T.ink, fontWeight: 500, marginTop: 2,
          }}>
            {fmtINRk(society.rentBand[0])} – {fmtINRk(society.rentBand[1])}
          </div>
          <button onClick={onPricing} style={{
            marginTop: 10, padding: "10px 16px", border: "none",
            background: T.emerald, color: T.paper, borderRadius: 10, cursor: "pointer",
            fontFamily: FONTS.sans, fontSize: 13, fontWeight: 500,
            display: "inline-flex", alignItems: "center", gap: 7,
          }}>
            <Sparkles size={14} /> Run AI Pricing
          </button>
        </div>
      </div>
    </>
  );
}
