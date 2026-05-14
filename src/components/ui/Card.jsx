import React from "react";
import { T } from "../../theme";

// Reusable card wrapper. The variant changes border radius and padding.
const VARIANTS = {
  default: { radius: 14, padding: 18 },
  large:   { radius: 16, padding: 24 },
  small:   { radius: 12, padding: 14 },
};

export default function Card({ children, variant = "default", padding, radius, style, ...rest }) {
  const v = VARIANTS[variant] || VARIANTS.default;
  return (
    <div {...rest} style={{
      background: T.card,
      border: `1px solid ${T.divider}`,
      borderRadius: radius ?? v.radius,
      padding: padding ?? v.padding,
      ...style,
    }}>
      {children}
    </div>
  );
}
