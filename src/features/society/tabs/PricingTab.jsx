import React from "react";
import { Sparkles } from "lucide-react";
import { T, FONTS } from "../../../theme";

export default function PricingTab({ onPricing }) {
  return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <button onClick={onPricing} style={{
        padding: "14px 22px", background: T.emerald, color: T.paper,
        border: "none", borderRadius: 12, cursor: "pointer",
        fontFamily: FONTS.sans, fontSize: 14, fontWeight: 500,
        display: "inline-flex", alignItems: "center", gap: 8,
      }}>
        <Sparkles size={16} /> Open AI Pricing Engine for this property
      </button>
    </div>
  );
}
