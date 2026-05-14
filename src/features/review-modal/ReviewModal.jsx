import React, { useEffect, useState } from "react";
import { Crosshair, X } from "lucide-react";
import { T, FONTS } from "../../theme";
import { Pill } from "../../components/ui";
import LocateStep from "./LocateStep";
import BadgePickerStep from "./BadgePickerStep";
import ReviewFormStep from "./ReviewFormStep";

const LOCATE_MS = 2400;

export default function ReviewModal({ society, onClose, onSubmit }) {
  const [step, setStep] = useState("locate"); // "locate" | "verified" | "form"
  const [badge, setBadge] = useState(null);

  useEffect(() => {
    if (step !== "locate") return undefined;
    const t = setTimeout(() => setStep("verified"), LOCATE_MS);
    return () => clearTimeout(t);
  }, [step]);

  const handlePickBadge = (id) => {
    setBadge(id);
    setStep("form");
  };

  const handleSubmit = (payload) => {
    onSubmit(payload);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(26,29,26,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 50, padding: 20,
    }}>
      <div style={{
        background: T.paper, borderRadius: 18, width: "100%", maxWidth: 560,
        maxHeight: "90vh", overflowY: "auto", border: `1px solid ${T.divider}`,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 22px", borderBottom: `1px solid ${T.divider}`,
        }}>
          <div>
            <Pill icon={Crosshair}>GPS-verified feedback</Pill>
            <div style={{ fontFamily: FONTS.serif, fontSize: 20, color: T.ink, marginTop: 6 }}>
              {society.name}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer", color: T.ink2,
          }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 22 }}>
          {step === "locate"   && <LocateStep />}
          {step === "verified" && !badge && <BadgePickerStep onPick={handlePickBadge} />}
          {step === "form"     && badge && (
            <ReviewFormStep badge={badge} onSubmit={handleSubmit} />
          )}
        </div>
      </div>
    </div>
  );
}
