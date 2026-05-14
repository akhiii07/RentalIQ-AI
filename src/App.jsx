import React, { useState } from "react";
import { T, FONTS } from "./theme";
import { Toast } from "./components/ui";
import { SOCIETIES, findSocietyByLocality } from "./data";
import { fmtINR } from "./utils";
import { ExploreView } from "./features/explore";
import { SocietyView } from "./features/society";
import { PricingView } from "./features/pricing";
import { ReviewModal } from "./features/review-modal";
import { TopNav, Footer, GlobalStyles, ExploreHero } from "./shell";

const VIEWS = { EXPLORE: "explore", SOCIETY: "society", PRICING: "pricing" };

export default function App() {
  const [view, setView] = useState(VIEWS.EXPLORE);
  const [selectedSociety, setSelectedSociety] = useState(SOCIETIES[0]);
  const [showReview, setShowReview] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSelectLocality = (localityId) => {
    const soc = findSocietyByLocality(localityId) || SOCIETIES[0];
    setSelectedSociety(soc);
    setView(VIEWS.SOCIETY);
  };

  return (
    <div style={{
      background: T.paper, minHeight: "100vh",
      color: T.ink, fontFamily: FONTS.sans,
    }}>
      <GlobalStyles />
      <TopNav onLogoClick={() => setView(VIEWS.EXPLORE)} />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 22px 80px" }}>
        {view === VIEWS.EXPLORE && (
          <div>
            <ExploreHero />
            <ExploreView onSelectLocality={handleSelectLocality} />
          </div>
        )}

        {view === VIEWS.SOCIETY && (
          <SocietyView
            society={selectedSociety}
            onBack={() => setView(VIEWS.EXPLORE)}
            onPricing={() => setView(VIEWS.PRICING)}
            onAddReview={() => setShowReview(true)}
          />
        )}

        {view === VIEWS.PRICING && (
          <PricingView
            society={selectedSociety}
            onBack={() => setView(VIEWS.SOCIETY)}
            onBidPlaced={(amt) =>
              setToast(`Bid of ${fmtINR(amt)} submitted. Owner notified. Demand signal recorded.`)
            }
          />
        )}
      </main>

      <Footer />

      {showReview && (
        <ReviewModal
          society={selectedSociety}
          onClose={() => setShowReview(false)}
          onSubmit={() => setToast("Verified feedback submitted. Trust weight applied.")}
        />
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
