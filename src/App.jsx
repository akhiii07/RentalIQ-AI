import React, { useState } from "react";
import { T, FONTS } from "./theme";
import { Toast } from "./components/ui";
import { SOCIETIES } from "./data";
import { fmtINR } from "./utils";
import { ExploreView } from "./features/explore";
import { SocietyView } from "./features/society";
import { PricingView } from "./features/pricing";
import { ReviewModal } from "./features/review-modal";
import { TopNav, Footer, GlobalStyles, ExploreHero } from "./shell";

const VIEWS = { EXPLORE: "explore", SOCIETY: "society", PRICING: "pricing" };

// Deterministic 0..1 hash from a key — used to spread synthetic society values
// derived from an apartment id so each apt yields stable, varied numbers.
const aptHash = (key, salt) => {
  const s = `${key}::${salt}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h) / 0x7fffffff;
};

// Adapter: clicked apartment → SocietyView-shaped object so the breadcrumb +
// society tabs render real data from the apartment, not a fallback.
const aptToSociety = (apt) => {
  const r = (salt) => aptHash(apt.id, salt);
  const sentiments = ["Family-friendly", "Young professionals", "Mixed crowd", "Quiet, professionals-heavy"];
  const parkings  = ["1 covered + visitor", "2 covered + bike slot", "1 open + extra ₹2.5k", "1 covered included"];
  return {
    id: apt.id,
    name: apt.name,
    locality: apt.localityId,
    units: 80 + Math.floor(r("u") * 280),
    age: apt.age,
    maintenance: +(7.6 + r("m") * 1.8).toFixed(1),
    parking: parkings[Math.floor(r("p") * parkings.length)],
    parkingScore: +(7.2 + r("ps") * 2.0).toFixed(1),
    noise: +(5.0 + r("n") * 2.8).toFixed(1),
    water: +(8.0 + r("w") * 1.6).toFixed(1),
    power: +(8.5 + r("e") * 1.3).toFixed(1),
    safety: +(7.8 + r("s") * 1.8).toFixed(1),
    sentiment: sentiments[Math.floor(r("st") * sentiments.length)],
    rentBand: [
      Math.round((apt.rent * 0.92) / 500) * 500,
      Math.round((apt.rent * 1.14) / 500) * 500,
    ],
    builderRating: +(7.8 + r("br") * 2.0).toFixed(1),
    tags: apt.tags || [],
  };
};

export default function App() {
  const [view, setView] = useState(VIEWS.EXPLORE);
  const [selectedSociety, setSelectedSociety] = useState(SOCIETIES[0]);
  const [showReview, setShowReview] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSelectApartment = (apt) => {
    setSelectedSociety(aptToSociety(apt));
    setView(VIEWS.SOCIETY);
  };

  return (
    <div style={{
      background: T.paper, minHeight: "100vh",
      color: T.ink, fontFamily: FONTS.sans,
    }}>
      <GlobalStyles />
      <TopNav onLogoClick={() => setView(VIEWS.EXPLORE)} />

      <main style={{
        width: "min(99%, 2600px)", margin: "0 auto",
        padding: "32px 0 96px",
      }}>
        {view === VIEWS.EXPLORE && (
          <div>
            <ExploreHero />
            {/* Viewport breakout — Explore card escapes the main cap so the
                map uses essentially the full viewport width. */}
            <div style={{
              width: "100vw", position: "relative",
              left: "50%", transform: "translateX(-50%)",
              paddingLeft: "max(8px, 0.5vw)", paddingRight: "max(8px, 0.5vw)",
              boxSizing: "border-box",
            }}>
              <ExploreView onSelectApartment={handleSelectApartment} />
            </div>
          </div>
        )}

        {view === VIEWS.SOCIETY && (
          <SocietyView
            society={selectedSociety}
            onBack={() => setView(VIEWS.EXPLORE)}
            onPricing={() => setView(VIEWS.PRICING)}
            onAddReview={() => setShowReview(true)}
            onToast={setToast}
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
