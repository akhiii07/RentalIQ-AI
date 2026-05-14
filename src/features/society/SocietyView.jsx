import React, { useState } from "react";
import { findLocality } from "../../data";
import SocietyHeader from "./SocietyHeader";
import SocietyTabs, { TABS } from "./SocietyTabs";
import { OverviewTab, AskNeighborTab, ReviewsTab, PricingTab } from "./tabs";

const TAB_COMPONENTS = {
  Overview:           OverviewTab,
  "Ask Neighbor":     AskNeighborTab,
  "Verified Reviews": ReviewsTab,
  Pricing:            PricingTab,
};

export default function SocietyView({ society, onBack, onPricing, onAddReview }) {
  const [tab, setTab] = useState(TABS[0]);
  const locality = findLocality(society.locality);
  const Tab = TAB_COMPONENTS[tab];

  return (
    <div>
      <SocietyHeader society={society} locality={locality} onBack={onBack} onPricing={onPricing} />
      <div style={{ marginTop: 22 }}>
        <SocietyTabs tab={tab} onTab={setTab} />
      </div>
      <Tab society={society} onPricing={onPricing} onAddReview={onAddReview} />
    </div>
  );
}
