import React from "react";
import {
  Wrench, Car, Droplet, Zap, Volume2, Shield, Users, Star,
  Sparkles, Check, AlertCircle, Quote, ArrowUpRight, MessageSquare,
} from "lucide-react";
import { T, FONTS } from "../../../theme";
import { Card, Pill, SectionHeader, Kicker } from "../../../components/ui";
import { REVIEWS_SEED } from "../../../data";
import { fmtINRk } from "../../../utils";
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

const MARKET_COMPARABLES = [
  { name: "Salarpuria Greenage", delta: -6, dist: "1.8 km",  match: 91 },
  { name: "Sobha Meadows",       delta: +4, dist: "2.4 km",  match: 88 },
  { name: "Purva Skywood",       delta: -2, dist: "3.1 km",  match: 84 },
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
          display: "flex", gap: 8, marginTop: 10,
          fontFamily: FONTS.serif, fontSize: 14.5, color: T.ink2, lineHeight: 1.5,
        }}>
          <Icon size={15} color={color} style={{ flexShrink: 0, marginTop: 3 }} />
          {s}
        </div>
      ))}
    </div>
  );
}

function ResidentQuote({ review }) {
  return (
    <div style={{
      background: T.paper, borderRadius: 12, padding: 16,
      border: `1px solid ${T.divider}`,
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <Quote size={20} color={T.clay} strokeWidth={1.8} />
      <div style={{
        fontFamily: FONTS.serif, fontSize: 15, fontStyle: "italic",
        color: T.ink, lineHeight: 1.55,
      }}>
        "{review.body}"
      </div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: 4,
      }}>
        <div style={{
          fontFamily: FONTS.sans, fontSize: 12, color: T.ink3,
        }}>
          {review.who}
        </div>
        <Pill tone={review.badge === "resident" ? "emerald" : review.badge === "visitor" ? "mustard" : "default"}>
          {review.badge}
        </Pill>
      </div>
    </div>
  );
}

function MarketRow({ row, baseRent }) {
  const positive = row.delta >= 0;
  const projRent = Math.round((baseRent * (1 + row.delta / 100)) / 500) * 500;
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1.6fr 0.9fr 0.9fr 0.6fr",
      alignItems: "center", gap: 12, padding: "10px 0",
      borderBottom: `1px dashed ${T.divider}`,
    }}>
      <div style={{ fontFamily: FONTS.serif, fontSize: 14, color: T.ink }}>
        {row.name}
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: T.ink2 }}>
        {fmtINRk(projRent)}
      </div>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 12,
        color: positive ? T.clay : T.emerald, fontWeight: 500,
      }}>
        {positive ? "+" : ""}{row.delta}%
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: T.ink3, textAlign: "right" }}>
        {row.match}% match
      </div>
    </div>
  );
}

export default function OverviewTab({ society, onPricing }) {
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

  const baseRent = (society.rentBand[0] + society.rentBand[1]) / 2;
  const featured = REVIEWS_SEED[0];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}>
      {/* LEFT — primary column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* AI synthesis (lead) */}
        <Card padding={22} style={{ borderRadius: 16 }}>
          <SectionHeader
            pill="AI synthesis" pillIcon={Sparkles}
            title="What residents consistently agree on"
            right={(
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: T.ink3 }}>
                Across 198 verified inputs
              </div>
            )}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 16 }}>
            <ConsensusList items={STRENGTHS} color={T.emerald} icon={Check}        label="Why renters stay" />
            <ConsensusList items={FRICTIONS} color={T.clay}    icon={AlertCircle}  label="What slows them down" />
          </div>
        </Card>

        {/* Factor scores */}
        <div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            marginBottom: 10,
          }}>
            <Kicker>The eight factors AI weighs</Kicker>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: T.ink3 }}>
              Resident-weighted · refreshed daily
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {tiles.map((t, i) => <FactorTile key={i} {...t} />)}
          </div>
        </div>

        {/* Resident voice teaser */}
        <Card padding={20} style={{ borderRadius: 16 }}>
          <SectionHeader
            pill="Resident voice" pillIcon={MessageSquare}
            title="Spotlight review"
            right={(
              <button style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: FONTS.sans, fontSize: 12, color: T.ink2,
                display: "inline-flex", alignItems: "center", gap: 4,
              }}>
                See all 198 <ArrowUpRight size={13} />
              </button>
            )}
          />
          <div style={{ marginTop: 12 }}>
            <ResidentQuote review={featured} />
          </div>
        </Card>
      </div>

      {/* RIGHT — supporting column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Card padding={18} style={{ borderRadius: 16 }}>
          <SectionHeader
            pill="Market position" pillIcon={Sparkles}
            title="Where this sits nearby"
          />
          <div style={{ marginTop: 10 }}>
            {MARKET_COMPARABLES.map((row) => (
              <MarketRow key={row.name} row={row} baseRent={baseRent} />
            ))}
          </div>
          <button onClick={onPricing} style={{
            marginTop: 14, width: "100%", padding: "10px 14px",
            background: T.ink, color: "#fff", border: "none",
            borderRadius: 10, cursor: "pointer",
            fontFamily: FONTS.sans, fontSize: 12.5, fontWeight: 500,
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <Sparkles size={13} /> Run AI Pricing on this unit
          </button>
        </Card>

        <Card padding={18} style={{ borderRadius: 16 }}>
          <Kicker color={T.clay}>What you'd be saving</Kicker>
          <div style={{
            fontFamily: FONTS.serif, fontSize: 22, color: T.ink,
            marginTop: 6, lineHeight: 1.2,
          }}>
            ₹4.2K/mo below the locality 3BHK median
          </div>
          <div style={{
            fontFamily: FONTS.sans, fontSize: 12.5, color: T.ink3,
            marginTop: 8, lineHeight: 1.5,
          }}>
            AI rates this listing as <b style={{ color: T.emerald }}>well-priced</b>{" "}
            for its connectivity, age, and resident scores. Walk-up offers
            in this band cleared within 12 days last quarter.
          </div>
        </Card>
      </div>
    </div>
  );
}
