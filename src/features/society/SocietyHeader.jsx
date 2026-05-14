import React from "react";
import {
  MapPin, Building2, Sparkles, Calendar, MessageCircle, Heart, ShieldCheck,
} from "lucide-react";
import { T, FONTS } from "../../theme";
import { Pill, Kicker, Breadcrumb } from "../../components/ui";
import { fmtINRk } from "../../utils";

// Stable gradient per society id — stands in for a hero photo until we have real images.
const PHOTO_GRADIENTS = [
  "linear-gradient(135deg, #C8552E 0%, #C99A2E 90%)",
  "linear-gradient(135deg, #1E6B52 0%, #C99A2E 95%)",
  "linear-gradient(140deg, #3B6E8F 0%, #1A1D1A 90%)",
  "linear-gradient(150deg, #A33F1E 0%, #C8552E 90%)",
  "linear-gradient(160deg, #6B6E66 0%, #1A1D1A 95%)",
  "linear-gradient(135deg, #0F4D3A 0%, #3B6E8F 90%)",
];

const hashIdx = (s, mod) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h) % mod;
};

const aiConfidence = (society) => {
  // Derived confidence: blend builder / safety / maintenance into 0-100.
  const raw = (society.builderRating + society.safety + society.maintenance) / 3;
  return Math.round((raw / 10) * 100);
};

const matchScore = (society) => {
  // Synthetic "fit for you" score — locks at 70-95 derived from key features.
  const raw = (society.builderRating + society.safety + society.water + society.power + society.maintenance) / 5;
  return Math.round(70 + (raw - 7) * 12);
};

function PhotoStrip({ id }) {
  const base = hashIdx(id, PHOTO_GRADIENTS.length);
  const grads = Array.from({ length: 4 }, (_, i) =>
    PHOTO_GRADIENTS[(base + i) % PHOTO_GRADIENTS.length]
  );
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "2.2fr 1fr 1fr",
      gridTemplateRows: "120px 120px",
      gap: 8,
      borderRadius: 16,
      overflow: "hidden",
    }}>
      <div style={{
        gridRow: "1 / span 2",
        background: grads[0],
        position: "relative",
        display: "flex", alignItems: "flex-end", padding: 14,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(0,0,0,0.32)", backdropFilter: "blur(8px)",
          color: "#fff", padding: "5px 11px", borderRadius: 99,
          fontFamily: FONTS.sans, fontSize: 11, fontWeight: 500, letterSpacing: 0.2,
        }}>
          <Sparkles size={11} /> AI-curated hero
        </div>
      </div>
      <div style={{ background: grads[1] }} />
      <div style={{ background: grads[2] }} />
      <div style={{ background: grads[3] }} />
    </div>
  );
}

function ConfidenceBar({ pct, color = T.emerald, label }) {
  return (
    <div>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        fontFamily: FONTS.sans, fontSize: 11, color: T.ink3,
        textTransform: "uppercase", letterSpacing: 1.3,
      }}>
        <span>{label}</span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 12, color, fontWeight: 500 }}>
          {pct}%
        </span>
      </div>
      <div style={{
        marginTop: 6, height: 6, borderRadius: 99,
        background: T.divider, overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: color,
          borderRadius: 99, transition: "width 600ms ease-out",
        }} />
      </div>
    </div>
  );
}

function CTAButton({ icon: Icon, label, primary, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", padding: "11px 14px",
      border: primary ? "none" : `1px solid ${T.divider}`,
      background: primary ? T.emerald : "#fff",
      color: primary ? "#fff" : T.ink,
      borderRadius: 10, cursor: "pointer",
      fontFamily: FONTS.sans, fontSize: 13, fontWeight: 500,
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      transition: "transform 0.12s, box-shadow 0.12s",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
      <Icon size={14} /> {label}
    </button>
  );
}

function DecisionCard({ society, onPricing, onAskNeighbor, onToast }) {
  const conf = aiConfidence(society);
  const match = matchScore(society);
  return (
    <div style={{
      background: "#fff", border: `1px solid ${T.divider}`,
      borderRadius: 16, padding: 18,
      boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      <div>
        <Kicker>3BHK rent band</Kicker>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 28,
          color: T.ink, fontWeight: 500, marginTop: 2, letterSpacing: -0.4,
        }}>
          {fmtINRk(society.rentBand[0])} – {fmtINRk(society.rentBand[1])}
          <span style={{
            fontFamily: FONTS.sans, fontSize: 12, color: T.ink3,
            marginLeft: 6, fontWeight: 400,
          }}>/mo</span>
        </div>
      </div>

      <ConfidenceBar pct={conf}  color={T.emerald} label="AI confidence" />
      <ConfidenceBar pct={match} color={T.clay}    label="Fit-for-you score" />

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
        <CTAButton icon={Sparkles}      label="Place a bid"     primary onClick={onPricing} />
        <CTAButton icon={Calendar}      label="Schedule a visit"        onClick={() => onToast?.("Visit request sent. Owner will confirm within 12 hrs.")} />
        <CTAButton icon={MessageCircle} label="Ask the neighbors"       onClick={() => onAskNeighbor?.()} />
        <CTAButton icon={Heart}         label="Save"                    onClick={() => onToast?.("Saved to your shortlist.")} />
      </div>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: FONTS.sans, fontSize: 11, color: T.ink3,
        marginTop: 2,
      }}>
        <ShieldCheck size={12} color={T.emerald} />
        Owner GPS-verified · No-broker direct
      </div>
    </div>
  );
}

export default function SocietyHeader({
  society, locality, onBack, onPricing, onAskNeighbor, onToast,
}) {
  return (
    <>
      <Breadcrumb items={[
        { label: "Atlas",        onClick: onBack },
        { label: locality.name },
        { label: society.name },
      ]} />

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 320px",
        gap: 24, marginTop: 14, alignItems: "stretch",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <PhotoStrip id={society.id} />

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Pill tone="default">Society profile</Pill>
              <Pill tone="emerald">
                <ShieldCheck size={10} /> Verified
              </Pill>
            </div>
            <h1 style={{
              fontFamily: FONTS.serif, fontSize: 52, fontWeight: 400,
              color: T.ink, margin: "10px 0 8px", letterSpacing: -0.7, lineHeight: 1.04,
            }}>
              {society.name}
            </h1>
            <div style={{
              display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap",
              fontFamily: FONTS.sans, fontSize: 13.5, color: T.ink2,
            }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <MapPin size={14} /> {locality.name}, Bengaluru
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Building2 size={14} /> {society.units} units · {society.age} yrs old
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Sparkles size={14} color={T.clay} />
                {society.sentiment}
              </span>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
              {(society.tags || []).map((t) => <Pill key={t}>{t}</Pill>)}
            </div>
          </div>
        </div>

        <DecisionCard
          society={society}
          onPricing={onPricing}
          onAskNeighbor={onAskNeighbor}
          onToast={onToast}
        />
      </div>
    </>
  );
}
