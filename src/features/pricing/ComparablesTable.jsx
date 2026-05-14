import React from "react";
import { Filter } from "lucide-react";
import { T, FONTS } from "../../theme";
import { Card, Pill, Kicker } from "../../components/ui";
import ComparableRow from "./ComparableRow";

const COLUMNS = "40px 1fr 70px 70px 90px 50px";

export default function ComparablesTable({ comps, onToggle, refPsf }) {
  const activeCount = comps.filter((c) => c.active).length;

  return (
    <Card padding={20} style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Pill icon={Filter}>Refine comparables</Pill>
          <div style={{ fontFamily: FONTS.serif, fontSize: 20, color: T.ink, marginTop: 8 }}>
            Adjust what counts as similar
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: T.ink3, marginTop: 3 }}>
            Toggle properties off to see pricing recompute. Your choices train future suggestions.
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <Kicker>Active</Kicker>
          <div style={{ fontFamily: FONTS.mono, fontSize: 20, color: T.ink, fontWeight: 500 }}>
            {activeCount} / {comps.length}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{
          display: "grid", gridTemplateColumns: COLUMNS,
          gap: 10, paddingBottom: 8, borderBottom: `1px solid ${T.divider}`,
          fontFamily: FONTS.sans, fontSize: 10,
          textTransform: "uppercase", letterSpacing: 1.3, color: T.ink3,
        }}>
          <span>Use</span>
          <span>Property</span>
          <span style={{ textAlign: "right" }}>Size</span>
          <span style={{ textAlign: "right" }}>Rent</span>
          <span style={{ textAlign: "right" }}>Match</span>
          <span style={{ textAlign: "right" }}>vs base</span>
        </div>
        {comps.map((c) => (
          <ComparableRow key={c.id} c={c} onToggle={onToggle} refPsf={refPsf} />
        ))}
      </div>
    </Card>
  );
}
