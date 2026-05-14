import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { T, FONTS } from "../../theme";
import { CityMap, HeatLegend } from "../../components/map";
import { findLocality, findAptsInLocality, APARTMENTS } from "../../data";
import LocalityReadout from "./LocalityReadout";
import DemandPulse from "./DemandPulse";

const DEFAULT_LOCALITY = "koramangala";

export default function ExploreView({ onSelectLocality }) {
  const [hoverId, setHoverId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [drilledInto, setDrilledInto] = useState(null);
  const [hoverAptId, setHoverAptId] = useState(null);

  const activeLoc = findLocality(hoverId || drilledInto || selected || DEFAULT_LOCALITY);
  const drilledLoc = drilledInto ? findLocality(drilledInto) : null;
  const apts = drilledInto ? findAptsInLocality(drilledInto) : [];

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
              {drilledLoc ? `Drill-in · ${apts.length} listings` : "Live Atlas · 20 areas"}
            </div>
            <div style={{
              fontFamily: FONTS.serif, fontSize: 26, fontWeight: 400,
              color: T.ink, marginTop: 2,
            }}>
              {drilledLoc ? drilledLoc.name : "Bengaluru — Rental Heatmap"}
            </div>
          </div>
          <HeatLegend />
        </div>

        <div style={{ position: "relative", paddingBottom: "62%" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <CityMap
              selected={selected}
              onSelect={(id) => { setSelected(id); onSelectLocality(id); }}
              hoverId={hoverId}
              setHoverId={setHoverId}
              drilledInto={drilledInto}
              setDrilledInto={setDrilledInto}
              onAptClick={(apt) => onSelectLocality(apt.localityId)}
              hoverAptId={hoverAptId}
              setHoverAptId={setHoverAptId}
            />
          </div>

          {/* Drill-back overlay button */}
          {drilledInto && (
            <button onClick={() => setDrilledInto(null)} style={{
              position: "absolute", top: 14, left: 14, zIndex: 500,
              padding: "8px 14px 8px 10px", border: `1px solid ${T.divider}`,
              background: "#fff", color: T.ink, borderRadius: 99,
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: FONTS.sans, fontSize: 12.5, fontWeight: 500,
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            }}>
              <ChevronLeft size={14} /> All localities
            </button>
          )}
        </div>

        <div style={{
          display: "flex", gap: 22, padding: "14px 24px", alignItems: "center",
          borderTop: `1px solid ${T.divider}`, fontFamily: FONTS.sans,
          fontSize: 12, color: T.ink3,
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 7, height: 7, borderRadius: 99, background: T.emerald }} />
            Live OpenStreetMap · CARTO
          </span>
          <span>
            {drilledInto
              ? "Hover or click a listing to see details"
              : "Click a zone to drill in to its listings"}
          </span>
          <span style={{ marginLeft: "auto", fontFamily: FONTS.mono }}>
            20 areas · {drilledInto ? apts.length : APARTMENTS.length} listings indexed
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
