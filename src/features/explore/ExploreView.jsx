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
    <div style={{ display: "grid", gridTemplateColumns: "1fr 440px", gap: 24, height: "100%" }}>
      <div style={{
        background: T.card, border: `1px solid ${T.divider}`, borderRadius: 18,
        overflow: "hidden", position: "relative",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06), 0 1px 0 rgba(0,0,0,0.02)",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 24px", borderBottom: `1px solid ${T.divider}`,
        }}>
          <div>
            <div style={{
              fontFamily: FONTS.sans, fontSize: 11,
              textTransform: "uppercase", letterSpacing: 1.7, color: T.ink3,
            }}>
              Live Atlas · 8 areas
            </div>
            <div style={{
              fontFamily: FONTS.serif, fontSize: 26, fontWeight: 400,
              color: T.ink, marginTop: 2,
            }}>
              Bengaluru — South & East Rental Belt
            </div>
          </div>
          <HeatLegend />
        </div>

        <div style={{ position: "relative", paddingBottom: "62%" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <CityMap selected={selected} onSelect={(id) => { setSelected(id); onSelectLocality(id); }}
                     hoverId={hoverId} setHoverId={setHoverId} />
          </div>
        </div>

        <div style={{
          display: "flex", gap: 22, padding: "14px 24px", alignItems: "center",
          borderTop: `1px solid ${T.divider}`, fontFamily: FONTS.sans,
          fontSize: 12, color: T.ink3,
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 7, height: 7, borderRadius: 99, background: T.emerald }} />
            Live OpenStreetMap tiles · CARTO
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            Click a pill to drill into a locality
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
