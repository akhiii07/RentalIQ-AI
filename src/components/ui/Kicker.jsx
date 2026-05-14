import React from "react";
import { T, FONTS } from "../../theme";

// The uppercase, letter-spaced label that prefixes most cards.
export default function Kicker({ children, color = T.ink3, size = 10, tracking = 1.4, style }) {
  return (
    <div style={{
      fontFamily: FONTS.sans, fontSize: size,
      textTransform: "uppercase", letterSpacing: tracking, color,
      fontWeight: 500, ...style,
    }}>
      {children}
    </div>
  );
}
