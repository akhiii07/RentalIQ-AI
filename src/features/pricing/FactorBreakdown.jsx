import React from "react";
import { T, FONTS } from "../../theme";
import { Card, Pill, Kicker } from "../../components/ui";
import { fmtINR } from "../../utils";
import FactorDeltaRow from "./FactorDeltaRow";

export default function FactorBreakdown({ pricing }) {
  return (
    <Card padding={20} style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Pill>Explainability layer</Pill>
          <div style={{ fontFamily: FONTS.serif, fontSize: 20, color: T.ink, marginTop: 8 }}>
            How we got to {fmtINR(pricing.price)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <Kicker>Comparables base</Kicker>
          <div style={{ fontFamily: FONTS.mono, fontSize: 18, color: T.ink2 }}>
            {fmtINR(pricing.base)}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        {pricing.factorDeltas.map((d, i) => (
          <FactorDeltaRow key={d.key ?? i} d={d} base={pricing.base} />
        ))}

        <div style={{
          display: "grid", gridTemplateColumns: "22px 1fr 110px 80px",
          alignItems: "center", gap: 10, padding: "12px 0 4px",
        }}>
          <span />
          <div style={{ fontFamily: FONTS.serif, fontSize: 15, color: T.ink, fontWeight: 500 }}>
            Final AI suggestion
          </div>
          <span />
          <div style={{
            fontFamily: FONTS.mono, fontSize: 14,
            color: T.ink, textAlign: "right", fontWeight: 600,
          }}>
            {fmtINR(pricing.price)}
          </div>
        </div>
      </div>
    </Card>
  );
}
