import React from "react";
import { Search, Sparkles, Hash } from "lucide-react";
import { T, FONTS } from "../theme";
import { Pill } from "../components/ui";

function Logo({ onClick }) {
  return (
    <div onClick={onClick}
         style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <div style={{
        width: 32, height: 32, background: T.ink, borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 21 L3 10 L12 3 L21 10 L21 21" stroke={T.paper}
                strokeWidth="2" strokeLinejoin="round" />
          <circle cx="12" cy="14" r="2.5" fill={T.mustard} />
        </svg>
      </div>
      <div>
        <div style={{
          fontFamily: FONTS.serif, fontSize: 18, fontWeight: 500,
          lineHeight: 1, letterSpacing: -0.3,
        }}>
          RentalIQ
          <span style={{
            fontFamily: FONTS.mono, fontSize: 9, color: T.clay,
            marginLeft: 5, letterSpacing: 1, verticalAlign: "top",
          }}>
            AI
          </span>
        </div>
        <div style={{
          fontFamily: FONTS.sans, fontSize: 9.5, color: T.ink3,
          letterSpacing: 1.4, textTransform: "uppercase", marginTop: 2,
        }}>
          Hyperlocal rental intelligence
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div style={{
      flex: 1, maxWidth: 720, margin: "0 auto",
      background: T.card, border: `1px solid ${T.divider}`, borderRadius: 99,
      padding: "10px 18px", display: "flex", alignItems: "center", gap: 12,
    }}>
      <Search size={16} color={T.ink3} />
      <input placeholder="Search a society, locality, or address in Bengaluru…"
             style={{
               background: "transparent", border: "none", outline: "none", flex: 1,
               fontFamily: FONTS.sans, fontSize: 14, color: T.ink,
             }} />
      <Pill tone="ink"><Hash size={10} />3BHK</Pill>
    </div>
  );
}

function StatsStrip() {
  return (
    <div style={{ borderTop: `1px solid ${T.divider}`, background: T.paperDark }}>
      <div style={{
        width: "min(99%, 2600px)", margin: "0 auto", padding: "8px 0",
        display: "flex", gap: 32, alignItems: "center",
        fontFamily: FONTS.mono, fontSize: 12.5, color: T.ink3, letterSpacing: 0.5,
      }}>
        <span><b style={{ color: T.ink }}>8,412</b> verified data points</span>
        <span><b style={{ color: T.ink }}>2,140</b> GPS-verified visitors</span>
        <span><b style={{ color: T.ink }}>198</b> resident-verified profiles</span>
        <span><b style={{ color: T.ink }}>91.2%</b> bid-clearance accuracy (90-day)</span>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, background: T.emerald, borderRadius: 99 }} />
          Live · pricing engine v0.4 trained 11 May
        </span>
      </div>
    </div>
  );
}

export default function TopNav({ onLogoClick }) {
  return (
    <header style={{
      borderBottom: `1px solid ${T.divider}`,
      background: T.paper, position: "sticky", top: 0, zIndex: 30,
    }}>
      <div style={{
        width: "min(99%, 2600px)", margin: "0 auto", padding: "16px 0",
        display: "flex", alignItems: "center", gap: 22,
      }}>
        <Logo onClick={onLogoClick} />
        <SearchBar />
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Pill icon={Sparkles}>AI v0.4</Pill>
          <div style={{
            width: 34, height: 34, borderRadius: 99,
            background: `linear-gradient(135deg, ${T.emerald}, ${T.mustard})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: T.paper, fontFamily: FONTS.serif, fontSize: 14, fontWeight: 500,
          }}>
            A
          </div>
        </div>
      </div>
      <StatsStrip />
    </header>
  );
}
