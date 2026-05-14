import React from "react";
import { T, FONTS } from "../../theme";

export default function Stat({ label, value, sub, mono = true }) {
  return (
    <div style={{ padding: "10px 0" }}>
      <div style={{
        fontFamily: FONTS.sans, fontSize: 10.5,
        textTransform: "uppercase", letterSpacing: 1.3, color: T.ink3, fontWeight: 500,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: mono ? FONTS.mono : FONTS.serif,
        fontSize: 21, fontWeight: 500, color: T.ink, marginTop: 3,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: FONTS.sans, fontSize: 11.5, color: T.ink3, marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  );
}
