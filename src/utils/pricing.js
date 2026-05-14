// Each spec contributes a delta = base * ((factors[key] - centre) * coef).
// A negative coef inverts the relationship (e.g. higher noise → lower rent).
const FACTOR_SPECS = [
  { key: "schools",     label: "School quality",          coef:  0.018, centre: 7.5 },
  { key: "connect",     label: "Connectivity & transit",  coef:  0.020, centre: 7.5 },
  { key: "safety",      label: "Safety perception",       coef:  0.014, centre: 7.5 },
  { key: "noise",       label: "Ambient noise (penalty)", coef: -0.012, centre: 5.5, inverted: true },
  { key: "parking",     label: "Parking availability",    coef:  0.012, centre: 7.0 },
  { key: "maintenance", label: "Maintenance quality",     coef:  0.013, centre: 7.5 },
];

const roundTo500 = (n) => Math.round(n / 500) * 500;

// Explainable, deterministic AI price.
// Returns { price, low, high, base, factorDeltas, confidence, spread }.
export function computeAIPrice(property, comparables, factors) {
  const active = comparables.filter((c) => c.active);
  if (!active.length) {
    return { price: 0, low: 0, high: 0, base: 0, factorDeltas: [], confidence: 0, spread: 0 };
  }

  // Weighted per-sqft mean, weighted by similarity.
  const wsum = active.reduce((a, c) => a + c.similarity, 0);
  const psf = active.reduce((a, c) => a + (c.rent / c.size) * c.similarity, 0) / wsum;
  const base = psf * property.size;

  const factorDeltas = FACTOR_SPECS.map((s) => ({
    key: s.key,
    k: s.label,
    v: base * ((factors[s.key] - s.centre) * s.coef),
    score: factors[s.key],
    inverted: !!s.inverted,
  }));

  const adjusted = base + factorDeltas.reduce((a, d) => a + d.v, 0);
  const avgSim = active.reduce((a, c) => a + c.similarity, 0) / active.length;
  // Confidence shrinks with fewer comparables and lower avg similarity.
  const spread = Math.max(0.05, 0.16 - avgSim * 0.10 - Math.min(active.length, 7) * 0.005);
  const price = roundTo500(adjusted);

  return {
    price,
    low: roundTo500(price * (1 - spread)),
    high: roundTo500(price * (1 + spread)),
    base: Math.round(base),
    factorDeltas,
    confidence: Math.round((1 - spread) * 100),
    spread,
  };
}
