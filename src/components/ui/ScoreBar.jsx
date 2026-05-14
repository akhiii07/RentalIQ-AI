import React from "react";
import { T } from "../../theme";

export default function ScoreBar({ score, max = 10, color = T.emerald }) {
  return (
    <div style={{ position: "relative", height: 6, background: "#E5DEC9", borderRadius: 99 }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: `${(score / max) * 100}%`, background: color, borderRadius: 99,
        transition: "width 400ms",
      }} />
    </div>
  );
}
