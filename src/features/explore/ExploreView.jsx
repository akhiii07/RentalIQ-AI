import React, { useState } from "react";
import { T, FONTS } from "../../theme";
import { CityMap, HeatLegend } from "../../components/map";
import { findLocality } from "../../data";
import LocalityReadout from "./LocalityReadout";
import DemandPulse from "./DemandPulse";

const DEFAULT_LOCALITY = "koramangala";

export default function ExploreView({ onSelectLocality }) {
  const [hoverId, setHoverId] = useState(null);
  const [selected, setSelected] = useState(null);
  const activeLoc = findLocality(hoverId || selected || DEFAULT_LOCALITY);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, height: "100%" }}>
      <div style={{
        background: T.card, border: `1px solid ${T.divider}`, borderRadius: 14,
        overflow: "hidden", position: "relative", boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 18px", borderBottom: `1px solid ${T.divider}`,
        }}>
          <div>
            <div style={{
              fontFamily: FONTS.sans, fontSize: 10,
              textTransform: "uppercase", letterSpacing: 1.6, color: T.ink3,
            }}>
              Atlas · Sheet 01
            </div>
            <div style={{
              fontFamily: FONTS.serif, fontSize: 22, fontWeight: 400,
              color: T.ink, marginTop: 1,
            }}>
              Bengaluru — South & East Rental Belt
            </div>
          </div>
          <HeatLegend />
        </div>

        <div style={{ position: "relative", paddingBottom: "60%" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <CityMap selected={selected} onSelect={(id) => { setSelected(id); onSelectLocality(id); }}
                     hoverId={hoverId} setHoverId={setHoverId} />
          </div>
        </div>

        <div style={{
          display: "flex", gap: 18, padding: "12px 18px",
          borderTop: `1px solid ${T.divider}`, fontFamily: FONTS.sans,
          fontSize: 11, color: T.ink3,
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 2, background: T.clay, opacity: 0.6,
              borderTop: `1px dashed ${T.clay}` }} />
            Metro line
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 2, borderTop: `1px dashed ${T.ink2}` }} />
            Outer Ring Road
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 6, background: T.sky, opacity: 0.4,
              borderRadius: 2 }} />
            Lake
          </span>
          <span style={{ marginLeft: "auto", fontFamily: FONTS.mono }}>
            Updated 14 May · 8,412 verified data points
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <LocalityReadout locality={activeLoc} hovering={!!hoverId} onDrillIn={onSelectLocality} />
        <DemandPulse onSelect={onSelectLocality} />
      </div>
    </div>
  );
}
