import React from "react";
import { BadgeCheck, Crosshair, Lock, Star } from "lucide-react";
import { T, FONTS } from "../../theme";
import { Card, Pill } from "../../components/ui";

export const BADGE_META = {
  resident: { label: "Verified resident",      tone: "emerald", icon: BadgeCheck, weight: "1.0×" },
  visitor:  { label: "GPS verified visitor",   tone: "mustard", icon: Crosshair,  weight: "0.6×" },
  anon:     { label: "Anonymous",              tone: "default", icon: Lock,       weight: "0.25×" },
};

export default function ReviewCard({ r }) {
  const m = BADGE_META[r.badge];
  return (
    <Card variant="small" padding={16} style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div>
          <Pill tone={m.tone} icon={m.icon}>{m.label}</Pill>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: T.ink2, marginTop: 8 }}>
            {r.who}
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: T.ink3, marginTop: 1 }}>
            {r.when} · trust weight {m.weight}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 18, color: T.ink, fontWeight: 500 }}>
            {r.score.toFixed(1)}
          </div>
          <div style={{ display: "inline-flex", gap: 1, marginTop: 1 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={10}
                    fill={i <= Math.round(r.score) ? T.mustard : "transparent"}
                    color={i <= Math.round(r.score) ? T.mustard : T.divider}
                    strokeWidth={1.5} />
            ))}
          </div>
        </div>
      </div>
      <div style={{
        fontFamily: FONTS.serif, fontSize: 14.5, color: T.ink, marginTop: 12, lineHeight: 1.55,
      }}>
        {r.body}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
        {r.tags.map((t) => <Pill key={t}>{t}</Pill>)}
      </div>
    </Card>
  );
}
