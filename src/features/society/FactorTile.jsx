import React from "react";
import { T, FONTS } from "../../theme";
import { Card, ScoreBar } from "../../components/ui";

export default function FactorTile({ icon: Icon, label, value, score, tone = T.emerald, sub }) {
  return (
    <Card variant="small" style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Icon size={16} color={T.ink3} strokeWidth={1.6} />
        {score !== undefined && (
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: tone, fontWeight: 500 }}>
            {score}/10
          </span>
        )}
      </div>
      <div style={{
        fontFamily: FONTS.sans, fontSize: 10,
        textTransform: "uppercase", letterSpacing: 1.3, color: T.ink3, marginTop: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: FONTS.serif, fontSize: 16, color: T.ink, marginTop: 2, lineHeight: 1.3,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ marginTop: 8 }}>
          <ScoreBar score={score} color={tone} />
        </div>
      )}
    </Card>
  );
}
