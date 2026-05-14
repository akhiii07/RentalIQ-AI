import React from "react";
import { T, FONTS } from "../../theme";

const TONES = {
  default: { bg: "#EDE6D6", fg: T.ink2,   border: T.divider },
  emerald: { bg: "#E2EDDE", fg: T.emerald, border: "#B7CDB1" },
  clay:    { bg: "#F3DCC4", fg: T.clay2,   border: "#E5BFA0" },
  ink:     { bg: T.ink,     fg: T.paper,   border: T.ink },
  mustard: { bg: "#F4E5BC", fg: "#7A5D14", border: "#DEC68C" },
};

export default function Pill({ children, tone = "default", icon: Icon }) {
  const s = TONES[tone] || TONES.default;
  return (
    <span style={{
      background: s.bg, color: s.fg, border: `1px solid ${s.border}`,
      fontFamily: FONTS.sans, fontSize: 11, fontWeight: 500,
      padding: "3px 9px", borderRadius: 999, display: "inline-flex",
      alignItems: "center", gap: 5, letterSpacing: 0.2, whiteSpace: "nowrap",
    }}>
      {Icon && <Icon size={11} strokeWidth={2} />}
      {children}
    </span>
  );
}
