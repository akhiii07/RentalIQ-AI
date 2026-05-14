import React, { useState } from "react";
import { Star, Send } from "lucide-react";
import { T, FONTS } from "../../theme";
import { Kicker } from "../../components/ui";

const STRUCTURED_PROMPTS = [
  { k: "noise",   q: "Noise level at night",  opts: ["Very quiet", "Mostly quiet", "Some noise", "Noisy"] },
  { k: "parking", q: "Parking availability",  opts: ["Plenty", "Adequate", "Tight", "Always full"] },
  { k: "water",   q: "Water reliability",     opts: ["Excellent", "Good", "Spotty", "Frequent issues"] },
  { k: "safety",  q: "Safety perception",     opts: ["Very safe", "Safe", "Mixed", "Concerns"] },
];

function StarPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} onClick={() => onChange(i)} style={{
          background: "transparent", border: "none", cursor: "pointer", padding: 0,
        }}>
          <Star size={28}
                fill={i <= value ? T.mustard : "transparent"}
                color={i <= value ? T.mustard : T.divider}
                strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}

function ChoiceChip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 11px",
      background: active ? T.ink : T.card,
      color: active ? T.paper : T.ink2,
      border: `1px solid ${active ? T.ink : T.divider}`,
      borderRadius: 99, cursor: "pointer",
      fontFamily: FONTS.sans, fontSize: 12,
    }}>
      {children}
    </button>
  );
}

export default function ReviewFormStep({ badge, onSubmit }) {
  const [score, setScore] = useState(4);
  const [answers, setAnswers] = useState({});

  return (
    <div>
      <Kicker>Overall</Kicker>
      <StarPicker value={score} onChange={setScore} />

      <div style={{ marginTop: 18 }}>
        {STRUCTURED_PROMPTS.map((s) => (
          <div key={s.k} style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: FONTS.serif, fontSize: 14, color: T.ink }}>
              {s.q}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              {s.opts.map((o) => (
                <ChoiceChip key={o}
                            active={answers[s.k] === o}
                            onClick={() => setAnswers({ ...answers, [s.k]: o })}>
                  {o}
                </ChoiceChip>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => onSubmit({ badge, score, answers })} style={{
        marginTop: 6, width: "100%", padding: "12px 14px", background: T.emerald,
        color: T.paper, border: "none", borderRadius: 10, cursor: "pointer",
        fontFamily: FONTS.sans, fontSize: 13, fontWeight: 500,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
      }}>
        <Send size={14} /> Submit verified feedback
      </button>

      <div style={{
        marginTop: 8, fontFamily: FONTS.sans, fontSize: 10.5,
        color: T.ink3, textAlign: "center", lineHeight: 1.5,
      }}>
        Older reviews lose weight over time. This one starts at full trust.
      </div>
    </div>
  );
}
