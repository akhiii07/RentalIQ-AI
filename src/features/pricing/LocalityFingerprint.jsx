import React from "react";
import { GraduationCap, Train, Shield, Volume2 } from "lucide-react";
import { T, FONTS } from "../../theme";
import { Card, Pill, ScoreFactorList } from "../../components/ui";

export default function LocalityFingerprint({ locality }) {
  const rows = [
    { k: "Schools",      v: locality.schools, icon: GraduationCap },
    { k: "Connectivity", v: locality.connect, icon: Train },
    { k: "Safety",       v: locality.safety,  icon: Shield },
    { k: "Noise",        v: locality.noise,   icon: Volume2, inverted: true },
  ];

  return (
    <Card padding={16}>
      <Pill>Locality fingerprint</Pill>
      <div style={{ fontFamily: FONTS.serif, fontSize: 15, color: T.ink, marginTop: 8 }}>
        {locality.name}
      </div>
      <div style={{ marginTop: 10 }}>
        <ScoreFactorList rows={rows} dense />
      </div>
    </Card>
  );
}
