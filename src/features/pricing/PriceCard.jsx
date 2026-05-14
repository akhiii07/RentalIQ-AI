import React from "react";
import { Sparkles } from "lucide-react";
import { T, FONTS } from "../../theme";
import { Card, Pill, Kicker } from "../../components/ui";
import { fmtINR } from "../../utils";
import PriceGauge from "./PriceGauge";

function CornerOrnament() {
  return (
    <svg style={{ position: "absolute", top: 0, right: 0, opacity: 0.05 }}
         width="180" height="180" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r="80" fill="none" stroke={T.ink} strokeWidth="0.5" />
      <circle cx="90" cy="90" r="60" fill="none" stroke={T.ink} strokeWidth="0.5" />
      <circle cx="90" cy="90" r="40" fill="none" stroke={T.ink} strokeWidth="0.5" />
      <line x1="90" y1="0"  x2="90"  y2="180" stroke={T.ink} strokeWidth="0.5" />
      <line x1="0"  y1="90" x2="180" y2="90"  stroke={T.ink} strokeWidth="0.5" />
    </svg>
  );
}

export default function PriceCard({ property, pricing }) {
  const overPct = ((property.listedRent - pricing.price) / pricing.price) * 100;

  return (
    <Card variant="large" style={{ position: "relative", overflow: "hidden" }}>
      <CornerOrnament />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Pill icon={Sparkles}>AI Contextual Pricing · v0.4</Pill>
          <div style={{
            fontFamily: FONTS.serif, fontSize: 13, color: T.ink3,
            marginTop: 10, letterSpacing: 0.3,
          }}>
            3BHK · {property.size} sqft · Floor {property.floor}/{property.totalFloors} · {property.furnishing}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 14 }}>
            <div style={{
              fontFamily: FONTS.serif, fontSize: 60, fontWeight: 400,
              color: T.ink, lineHeight: 1, letterSpacing: -2,
            }}>
              {fmtINR(pricing.price)}
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 13, color: T.ink3 }}>/month</div>
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: T.ink2, marginTop: 6 }}>
            Confidence band {fmtINR(pricing.low)} – {fmtINR(pricing.high)} · {pricing.confidence}% confident
          </div>
        </div>

        <div style={{ textAlign: "right", zIndex: 1 }}>
          <Kicker>Listed asking</Kicker>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 22,
            color: T.clay, fontWeight: 500, marginTop: 2,
          }}>
            {fmtINR(property.listedRent)}
          </div>
          <Pill tone="clay">+{overPct.toFixed(1)}% above AI fair</Pill>
        </div>
      </div>

      <PriceGauge low={pricing.low} price={pricing.price}
                  high={pricing.high} listed={property.listedRent} />
    </Card>
  );
}
