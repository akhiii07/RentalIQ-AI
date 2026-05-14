import React from "react";
import { T, FONTS } from "../../theme";
import Pill from "./Pill";

// Pill + Fraunces title combo used at the top of most cards.
export default function SectionHeader({
  pill, pillTone = "default", pillIcon, title, subtitle, right, titleSize = 20,
}) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: right ? "center" : "flex-start", gap: 14,
    }}>
      <div>
        {pill && <Pill tone={pillTone} icon={pillIcon}>{pill}</Pill>}
        {title && (
          <div style={{
            fontFamily: FONTS.serif, fontSize: titleSize,
            color: T.ink, marginTop: 8, lineHeight: 1.2,
          }}>
            {title}
          </div>
        )}
        {subtitle && (
          <div style={{
            fontFamily: FONTS.sans, fontSize: 12,
            color: T.ink3, marginTop: 4, maxWidth: 520, lineHeight: 1.5,
          }}>
            {subtitle}
          </div>
        )}
      </div>
      {right}
    </div>
  );
}
