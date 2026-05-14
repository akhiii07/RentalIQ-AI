import React from "react";
import { T, FONTS } from "../theme";
import { Kicker } from "../components/ui";

// Title block shown above the map.
export default function ExploreHero() {
  return (
    <div style={{ marginBottom: 36 }}>
      <Kicker color={T.clay} tracking={1.6} size={13}>Bengaluru · May 2026</Kicker>
      <h1 style={{
        fontFamily: FONTS.serif, fontSize: 76, fontWeight: 400,
        color: T.ink, margin: "10px 0 0", letterSpacing: -1.4, lineHeight: 1.02,
      }}>
        Read the city <em style={{ color: T.clay }}>before</em>{" "}
        you sign the lease.
      </h1>
      <p style={{
        fontFamily: FONTS.serif, fontSize: 22, color: T.ink2,
        marginTop: 20, maxWidth: 980, lineHeight: 1.5, fontStyle: "italic",
      }}>
        Locality intelligence, verified neighbor voices, and an AI engine
        that prices each home on the things brokers don't quantify —
        school access, road noise, parking, and how the society actually feels.
      </p>
    </div>
  );
}
