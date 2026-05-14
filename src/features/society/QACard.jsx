import React, { useState } from "react";
import { ChevronRight, BadgeCheck, Eye } from "lucide-react";
import { T, FONTS } from "../../theme";
import { Card, Pill, Kicker } from "../../components/ui";

const toneFor = (sentiment) =>
  sentiment === "positive" ? T.emerald : sentiment === "negative" ? T.clay : T.ink3;

const pillTone = (sentiment) =>
  sentiment === "positive" ? "emerald" : sentiment === "negative" ? "clay" : "default";

export default function QACard({ q, idx }) {
  const [open, setOpen] = useState(idx === 0);
  const tone = toneFor(q.sentiment);

  return (
    <Card variant="small" padding={16} style={{ marginBottom: 10 }}>
      <div onClick={() => setOpen(!open)} style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", cursor: "pointer", gap: 14,
      }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flex: 1 }}>
          <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.ink4, paddingTop: 4 }}>
            Q{String(idx + 1).padStart(2, "0")}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONTS.serif, fontSize: 17, color: T.ink, lineHeight: 1.35 }}>
              {q.q}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
              <Pill tone={pillTone(q.sentiment)}>{q.sentiment}</Pill>
              <span style={{ fontFamily: FONTS.sans, fontSize: 11, color: T.ink3 }}>
                {q.responses} verified responses
              </span>
            </div>
          </div>
        </div>
        <div style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 200ms" }}>
          <ChevronRight size={16} color={T.ink3} />
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px dashed ${T.divider}` }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 3, alignSelf: "stretch", background: tone, borderRadius: 2 }} />
            <div style={{ flex: 1 }}>
              <Kicker>AI-summarized from {q.responses} responses</Kicker>
              <div style={{
                fontFamily: FONTS.serif, fontStyle: "italic",
                fontSize: 15, color: T.ink, marginTop: 4, lineHeight: 1.55,
              }}>
                "{q.summary}"
              </div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <Kicker style={{ marginBottom: 8 }}>Sample voices</Kicker>
            {q.voices.map((v, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, padding: "8px 0",
                borderTop: i > 0 ? `1px dashed ${T.divider}` : "none",
              }}>
                <Pill tone={v.badge === "resident" ? "emerald" : "default"}
                      icon={v.badge === "resident" ? BadgeCheck : Eye}>
                  {v.badge === "resident" ? "Verified resident" : "GPS visitor"}
                </Pill>
                <span style={{
                  fontFamily: FONTS.serif, fontSize: 13.5, fontStyle: "italic",
                  color: T.ink2, flex: 1, lineHeight: 1.4,
                }}>
                  "{v.t}"
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
