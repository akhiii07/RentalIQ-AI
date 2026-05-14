import React from "react";
import { T, FONTS } from "../../theme";
import { Pill, Toggle } from "../../components/ui";
import { fmtINRk } from "../../utils";

const matchTone = (sim) => (sim >= 0.85 ? "emerald" : sim >= 0.75 ? "mustard" : "default");

export default function ComparableRow({ c, onToggle, refPsf }) {
  const psf = c.rent / c.size;
  const delta = ((psf - refPsf) / refPsf) * 100;

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "40px 1fr 70px 70px 90px 50px",
      alignItems: "center", gap: 10, padding: "10px 0",
      borderBottom: `1px dashed ${T.divider}`, opacity: c.active ? 1 : 0.45,
    }}>
      <Toggle on={c.active} onChange={() => onToggle(c.id)} />
      <div>
        <div style={{ fontFamily: FONTS.serif, fontSize: 14, color: T.ink }}>
          {c.name}
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: T.ink3, marginTop: 1 }}>
          Floor {c.floor} · {c.age} yrs · {c.dist} km away
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: T.ink3 }}>
          {c.size} sqft
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: T.ink, fontWeight: 500 }}>
          {fmtINRk(c.rent)}
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.ink3 }}>
          ₹{psf.toFixed(1)}/sqft
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <Pill tone={matchTone(c.similarity)}>
          {Math.round(c.similarity * 100)}% match
        </Pill>
      </div>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 11,
        color: delta > 0 ? T.clay : T.emerald, textAlign: "right",
      }}>
        {delta > 0 ? "+" : ""}{delta.toFixed(0)}%
      </div>
    </div>
  );
}
