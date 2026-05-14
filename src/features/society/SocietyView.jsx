import React, { useState } from "react";
import { findLocality } from "../../data";
import SocietyHeader from "./SocietyHeader";
import SocietyTabs, { TABS } from "./SocietyTabs";
import TrustRibbon from "./TrustRibbon";
import { OverviewTab, AskNeighborTab, ReviewsTab, PricingTab } from "./tabs";

const TAB_COMPONENTS = {
  Overview:           OverviewTab,
  "Ask Neighbor":     AskNeighborTab,
  "Verified Reviews": ReviewsTab,
  Pricing:            PricingTab,
};

export default function SocietyView({ society, onBack, onPricing, onAddReview, onToast }) {
  const [tab, setTab] = useState(TABS[0]);
  const locality = findLocality(society.locality);
  const Tab = TAB_COMPONENTS[tab];

  return (
    <div>
      <SocietyHeader
        society={society}
        locality={locality}
        onBack={onBack}
        onPricing={onPricing}
        onAskNeighbor={() => setTab("Ask Neighbor")}
        onToast={onToast}
      />
      <TrustRibbon society={society} />
      <div style={{ marginTop: 26 }}>
        <SocietyTabs tab={tab} onTab={setTab} />
      </div>
      <Tab society={society} onPricing={onPricing} onAddReview={onAddReview} />
    </div>
  );
}
