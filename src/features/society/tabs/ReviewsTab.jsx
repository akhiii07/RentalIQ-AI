import React from "react";
import { Crosshair } from "lucide-react";
import { T, FONTS } from "../../../theme";
import { Card, Stat } from "../../../components/ui";
import { REVIEWS_SEED } from "../../../data";
import ReviewCard from "../ReviewCard";

export default function ReviewsTab({ onAddReview }) {
  return (
    <div>
      <Card style={{
        marginBottom: 14, display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 14, alignItems: "center",
      }}>
        <Stat label="Verified score"      value="4.3 / 5" sub="weighted, decayed" />
        <Stat label="Verified residents"  value="68"      sub="trust weight 1.0×" />
        <Stat label="GPS visitors"        value="142"     sub="trust weight 0.6×" />
        <Stat label="Anonymous"           value="29"      sub="trust weight 0.25×" />
        <button onClick={onAddReview} style={{
          padding: "10px 14px", border: "none", background: T.ink,
          color: T.paper, borderRadius: 10, cursor: "pointer",
          fontFamily: FONTS.sans, fontSize: 12, fontWeight: 500,
          display: "inline-flex", alignItems: "center", gap: 7,
        }}>
          <Crosshair size={13} /> Add GPS-verified review
        </button>
      </Card>
      {REVIEWS_SEED.map((r) => <ReviewCard key={r.id} r={r} />)}
    </div>
  );
}
