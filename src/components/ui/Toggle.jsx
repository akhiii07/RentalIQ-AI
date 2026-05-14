import React from "react";
import { T } from "../../theme";

export default function Toggle({ on, onChange }) {
  return (
    <button onClick={onChange} style={{
      width: 34, height: 18, borderRadius: 99,
      background: on ? T.emerald : "#C8C2B0",
      position: "relative", border: "none", cursor: "pointer",
      transition: "all 200ms",
    }}>
      <span style={{
        position: "absolute", top: 2, left: on ? 18 : 2, width: 14, height: 14,
        background: T.paper, borderRadius: 99, transition: "left 200ms",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}
