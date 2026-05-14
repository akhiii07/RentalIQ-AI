import React, { useMemo, useState } from "react";
import { Breadcrumb } from "../../components/ui";
import { COMPARABLES_SEED, FOCUS_PROPERTY, findLocality } from "../../data";
import { computeAIPrice } from "../../utils";
import PriceCard from "./PriceCard";
import FactorBreakdown from "./FactorBreakdown";
import ComparablesTable from "./ComparablesTable";
import ExplainerChat from "./ExplainerChat";
import BidPanel from "./BidPanel";
import LocalityFingerprint from "./LocalityFingerprint";

function buildFactors(locality, society) {
  return {
    schools:     locality.schools,
    connect:     locality.connect,
    safety:      locality.safety,
    noise:       locality.noise,
    parking:     society.parkingScore,
    maintenance: society.maintenance,
  };
}

export default function PricingView({ society, onBack, onBidPlaced }) {
  const locality = findLocality(society.locality);
  const [comps, setComps] = useState(COMPARABLES_SEED);

  const factors = useMemo(() => buildFactors(locality, society), [locality, society]);
  const pricing = useMemo(
    () => computeAIPrice(FOCUS_PROPERTY, comps, factors),
    [comps, factors]
  );

  const refPsf = pricing.base / FOCUS_PROPERTY.size;
  const toggle = (id) =>
    setComps(comps.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));

  return (
    <div>
      <Breadcrumb items={[
        { label: society.name,             onClick: onBack },
        { label: "AI Pricing · Unit #401" },
      ]} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, marginTop: 14 }}>
        <div>
          <PriceCard property={FOCUS_PROPERTY} pricing={pricing} />
          <FactorBreakdown pricing={pricing} />
          <ComparablesTable comps={comps} onToggle={toggle} refPsf={refPsf} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <ExplainerChat pricing={pricing} />
          <BidPanel pricing={pricing} onBidPlaced={onBidPlaced} />
          <LocalityFingerprint locality={locality} />
        </div>
      </div>
    </div>
  );
}
