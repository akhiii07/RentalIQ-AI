import React from "react";
import { T, FONTS } from "../../theme";

export default function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0" }}>
      <div style={{ flex: 1, height: 1, background: T.divider }} />
      {label && (
        <div style={{
          fontFamily: FONTS.sans, fontSize: 10,
          letterSpacing: 1.5, textTransform: "uppercase", color: T.ink4,
        }}>
          {label}
        </div>
      )}
      {label && <div style={{ flex: 1, height: 1, background: T.divider }} />}
    </div>
  );
}
