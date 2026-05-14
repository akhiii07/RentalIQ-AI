import React from "react";
import { T, FONTS } from "../../theme";

export const TABS = ["Overview", "Ask Neighbor", "Verified Reviews", "Pricing"];

export default function SocietyTabs({ tab, onTab }) {
  return (
    <div style={{
      display: "flex", gap: 0,
      borderBottom: `1px solid ${T.divider}`, marginBottom: 18,
    }}>
      {TABS.map((t) => (
        <button key={t} onClick={() => onTab(t)} style={{
          background: "transparent", border: "none", cursor: "pointer",
          padding: "12px 18px", marginBottom: -1,
          fontFamily: FONTS.sans, fontSize: 13,
          color: tab === t ? T.ink : T.ink3,
          borderBottom: tab === t ? `2px solid ${T.ink}` : "2px solid transparent",
          fontWeight: tab === t ? 600 : 400,
        }}>
          {t}
        </button>
      ))}
    </div>
  );
}
