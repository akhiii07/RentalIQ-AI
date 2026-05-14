import React from "react";
import { ChevronLeft } from "lucide-react";
import { T, FONTS } from "../../theme";

// items: [{ label: string, onClick?: () => void }, ...]
// The last item is rendered in ink (current), prior items are clickable.
// The first item gets a back-chevron prefix.
export default function Breadcrumb({ items }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      fontFamily: FONTS.sans, fontSize: 11, color: T.ink3,
      textTransform: "uppercase", letterSpacing: 1.3,
    }}>
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        const isFirst = i === 0;
        const node = it.onClick ? (
          <button onClick={it.onClick} style={{
            background: "none", border: "none", cursor: "pointer",
            color: isLast ? T.ink : T.ink3, padding: 0,
            display: "inline-flex", gap: 5, alignItems: "center",
            fontFamily: FONTS.sans, fontSize: 11,
            textTransform: "uppercase", letterSpacing: 1.3,
          }}>
            {isFirst && <ChevronLeft size={13} />}
            {it.label}
          </button>
        ) : (
          <span style={{ color: isLast ? T.ink : T.ink3 }}>{it.label}</span>
        );
        return (
          <React.Fragment key={i}>
            {node}
            {!isLast && <span>/</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}
