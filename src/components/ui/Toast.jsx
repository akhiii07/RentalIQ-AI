import React, { useEffect } from "react";
import { Check } from "lucide-react";
import { T, FONTS } from "../../theme";

export default function Toast({ message, onClose, ttlMs = 3800 }) {
  useEffect(() => {
    const t = setTimeout(onClose, ttlMs);
    return () => clearTimeout(t);
  }, [onClose, ttlMs]);

  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: T.ink, color: T.paper, padding: "14px 22px", borderRadius: 99,
      fontFamily: FONTS.sans, fontSize: 13, zIndex: 60,
      boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <Check size={15} color={T.paper} />
      {message}
    </div>
  );
}
