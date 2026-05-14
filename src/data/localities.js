// 20 top Bengaluru localities — real lat/lng centroids + procedurally generated
// irregular polygon boundaries (seeded per id so they're stable across reloads).
// `heat` is derived from avgRent; it's an index into T.heat[] for the choropleth.

const hashCode = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return h;
};

const mulberry32 = (seed) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Irregular ~7-sided polygon around (lat, lng), radius ~baseR° (≈1 km).
const makePolygon = (lat, lng, seed, baseR = 0.009) => {
  const rng = mulberry32(hashCode(seed));
  const sides = 7;
  return Array.from({ length: sides }, (_, i) => {
    const angle = (i / sides) * Math.PI * 2 + (rng() - 0.5) * 0.4;
    const r = baseR * (0.72 + rng() * 0.56);
    return [lat + Math.sin(angle) * r, lng + Math.cos(angle) * r];
  });
};

// Map avgRent (₹/mo for 3BHK) → heat index 0..5 (light → dark).
const heatFromRent = (rent) => {
  if (rent >= 50000) return 5;
  if (rent >= 44000) return 4;
  if (rent >= 38000) return 3;
  if (rent >= 32000) return 2;
  if (rent >= 26000) return 1;
  return 0;
};

const RAW = [
  { id:"indiranagar", name:"Indiranagar", lat:12.9784, lng:77.6408, avgRent:52000, trend:+9.2, demand:"Very High",
    score:9.1, safety:8.6, connect:9.4, schools:8.9, amenity:9.5, noise:6.4,
    blurb:"Café-strip energy, premium pricing, walkable lanes." },
  { id:"koramangala", name:"Koramangala", lat:12.9352, lng:77.6245, avgRent:48000, trend:+8.1, demand:"Very High",
    score:8.7, safety:8.3, connect:9.0, schools:8.7, amenity:9.3, noise:6.8,
    blurb:"Startup-belt favorite, dense, well-connected." },
  { id:"hsr",  name:"HSR Layout", lat:12.9116, lng:77.6474, avgRent:42000, trend:+7.4, demand:"High",
    score:8.4, safety:8.7, connect:8.4, schools:8.5, amenity:8.8, noise:5.4,
    blurb:"Grid-planned, family-friendly, calmer evenings." },
  { id:"jayanagar", name:"Jayanagar", lat:12.9250, lng:77.5938, avgRent:40000, trend:+5.8, demand:"High",
    score:8.5, safety:9.0, connect:8.6, schools:9.0, amenity:8.7, noise:5.0,
    blurb:"Old-money charm, parks, bakeries, tree-lined streets." },
  { id:"frazer-town", name:"Frazer Town", lat:13.0067, lng:77.6131, avgRent:44000, trend:+6.4, demand:"High",
    score:8.3, safety:8.4, connect:8.8, schools:8.5, amenity:8.6, noise:6.6,
    blurb:"Heritage bungalows, Ramzan food street, central." },
  { id:"basavanagudi", name:"Basavanagudi", lat:12.9423, lng:77.5736, avgRent:38000, trend:+4.9, demand:"Moderate",
    score:8.2, safety:8.8, connect:8.2, schools:8.7, amenity:8.4, noise:5.2,
    blurb:"Traditional South Bengaluru, temples, slow pace." },
  { id:"malleshwaram", name:"Malleshwaram", lat:13.0035, lng:77.5709, avgRent:38000, trend:+5.1, demand:"Moderate",
    score:8.3, safety:8.6, connect:8.7, schools:8.6, amenity:8.5, noise:5.4,
    blurb:"Old Bengaluru, filter coffee, walkable, metro-served." },
  { id:"bellandur", name:"Bellandur", lat:12.9304, lng:77.6784, avgRent:38000, trend:+6.0, demand:"High",
    score:7.9, safety:7.8, connect:7.6, schools:8.1, amenity:8.0, noise:6.1,
    blurb:"Closer to ORR offices, lake views, traffic-heavy." },
  { id:"whitefield", name:"Whitefield", lat:12.9698, lng:77.7500, avgRent:36000, trend:+5.2, demand:"High",
    score:7.7, safety:8.0, connect:7.2, schools:8.6, amenity:8.3, noise:5.6,
    blurb:"IT corridor classic, gated societies, school options." },
  { id:"hebbal", name:"Hebbal", lat:13.0356, lng:77.5970, avgRent:36000, trend:+5.5, demand:"High",
    score:7.9, safety:8.2, connect:8.5, schools:8.0, amenity:7.8, noise:6.0,
    blurb:"Airport-side, lakeside towers, fast ORR access." },
  { id:"cv-raman-nagar", name:"CV Raman Nagar", lat:12.9844, lng:77.6606, avgRent:36000, trend:+4.7, demand:"Moderate",
    score:7.6, safety:8.1, connect:8.0, schools:7.8, amenity:7.5, noise:5.6,
    blurb:"Quiet defense colony, ISRO neighborhood, value-priced." },
  { id:"jpnagar", name:"JP Nagar", lat:12.9081, lng:77.5831, avgRent:34000, trend:+4.6, demand:"Moderate",
    score:7.8, safety:8.5, connect:7.4, schools:8.2, amenity:8.0, noise:4.8,
    blurb:"Leafy, residential, slower pace, value picks." },
  { id:"btm", name:"BTM Layout", lat:12.9166, lng:77.6101, avgRent:32000, trend:+4.3, demand:"Moderate",
    score:7.5, safety:7.8, connect:8.2, schools:7.6, amenity:8.1, noise:6.6,
    blurb:"Affordable, central, popular with early-career pros." },
  { id:"marathahalli", name:"Marathahalli", lat:12.9591, lng:77.6974, avgRent:32000, trend:+4.1, demand:"Moderate",
    score:7.3, safety:7.4, connect:7.8, schools:7.6, amenity:7.9, noise:7.0,
    blurb:"Commute-friendly, busy junctions, mid-range stock." },
  { id:"rajajinagar", name:"Rajajinagar", lat:12.9991, lng:77.5554, avgRent:32000, trend:+4.0, demand:"Moderate",
    score:7.7, safety:8.3, connect:8.4, schools:8.0, amenity:7.9, noise:5.8,
    blurb:"West Bengaluru classic, metro-served, family-style." },
  { id:"sarjapur", name:"Sarjapur Road", lat:12.9010, lng:77.6874, avgRent:30000, trend:+3.5, demand:"Emerging",
    score:7.1, safety:7.6, connect:6.9, schools:7.4, amenity:7.2, noise:5.2,
    blurb:"Newer towers, emerging amenities, longer commutes." },
  { id:"banashankari", name:"Banashankari", lat:12.9255, lng:77.5468, avgRent:28000, trend:+3.8, demand:"Moderate",
    score:7.4, safety:8.2, connect:7.6, schools:7.8, amenity:7.5, noise:5.0,
    blurb:"South-west residential, temple town, metro extending." },
  { id:"kr-puram", name:"KR Puram", lat:13.0058, lng:77.6979, avgRent:26000, trend:+3.2, demand:"Emerging",
    score:6.9, safety:7.2, connect:7.4, schools:7.2, amenity:7.0, noise:6.8,
    blurb:"Whitefield gateway, mixed stock, value-priced." },
  { id:"yelahanka", name:"Yelahanka", lat:13.1007, lng:77.5963, avgRent:26000, trend:+4.5, demand:"Emerging",
    score:7.3, safety:8.0, connect:7.0, schools:7.6, amenity:7.4, noise:4.6,
    blurb:"Quiet northern suburb, airport-side, gated stock." },
  { id:"electronic-city", name:"Electronic City", lat:12.8456, lng:77.6603, avgRent:24000, trend:+3.6, demand:"Emerging",
    score:7.0, safety:7.8, connect:6.6, schools:7.2, amenity:7.0, noise:6.0,
    blurb:"IT corridor south, elevated expressway, large gated stock." },
];

export const LOCALITIES = RAW.map((loc) => ({
  ...loc,
  polygon: makePolygon(loc.lat, loc.lng, loc.id),
  heat: heatFromRent(loc.avgRent),
}));

export const findLocality = (id) => LOCALITIES.find((l) => l.id === id);

// Bounds the map view should never escape (rough Bengaluru envelope).
export const BLR_BOUNDS = [
  [12.78, 77.45],
  [13.15, 77.80],
];
