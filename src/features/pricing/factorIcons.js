import {
  GraduationCap, Train, Shield, Volume2, Car, Wrench,
} from "lucide-react";

// Maps the factor `key` returned by computeAIPrice to a Lucide icon.
export const FACTOR_ICONS = {
  schools:     GraduationCap,
  connect:     Train,
  safety:      Shield,
  noise:       Volume2,
  parking:     Car,
  maintenance: Wrench,
};
