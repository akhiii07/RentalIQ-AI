import React from "react";
import { BadgeCheck, Crosshair, Lock, Check, ChevronRight } from "lucide-react";
import { T, FONTS } from "../../theme";

const BADGES = [
  { id: "resident", label: "Verified resident",     weight: "1.0×",
    desc: "I currently live here. Highest trust weight.",      icon: BadgeCheck, tone: "emerald" },
  { id: "visitor",  label: "GPS-verified visitor",  weight: "0.6×",
    desc: "I visited the property today. Medium trust weight.", icon: Crosshair, tone: "mustard" },
  { id: "anon",     label: "Anonymous",             weight: "0.25×",
    desc: "I'd rather not disclose. Lower trust weight.",       icon: Lock,       tone: "default" },
];

const ICON_COLOR = { emerald: T.emerald, mustard: T.mustard, default: T.ink2 };

export default function BadgePickerStep({ onPick }) {
  return (
    <div>
      <div style={{
        background: "#E2EDDE", border: `1px solid #B7CDB1`, borderRadius: 12,
        padding: 14, display: "flex", gap: 12, alignItems: "center",
      }}>
        <Check size={20} color={T.emerald} strokeWidth={2.5} />
        <div>
          <div style={{
            fontFamily: FONTS.serif, fontSize: 15, color: T.emerald, fontWeight: 500,
          }}>
            Verified — within 32 m of Prestige Acropolis
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: T.ink2, marginTop: 2 }}>
            Pick the badge that best describes your relationship to this property.
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {BADGES.map((b) => {
          const Icon = b.icon;
          return (
            <button key={b.id} onClick={() => onPick(b.id)} style={{
              display: "flex", gap: 12, alignItems: "center", padding: 14,
              background: T.card, border: `1px solid ${T.divider}`,
              borderRadius: 12, cursor: "pointer", textAlign: "left",
            }}>
              <Icon size={18} color={ICON_COLOR[b.tone]} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONTS.serif, fontSize: 15, color: T.ink }}>
                  {b.label}
                  <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: T.ink3, marginLeft: 6 }}>
                    {b.weight}
                  </span>
                </div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 11.5, color: T.ink3, marginTop: 1 }}>
                  {b.desc}
                </div>
              </div>
              <ChevronRight size={16} color={T.ink3} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
