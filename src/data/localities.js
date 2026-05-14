// Real Bengaluru locality coordinates (lat/lng) — used by Leaflet map.
// avgRent in INR/mo (3BHK), trend in % YoY, scores on 0-10 scale.
// `heat` is an index into T.heat[] used for marker fill colour.
export const LOCALITIES = [
  { id:"indiranagar", name:"Indiranagar", avgRent:46500, trend:+9.2, demand:"Very High",
    score:9.1, safety:8.6, connect:9.4, schools:8.9, amenity:9.5, noise:6.4,
    lat:12.9784, lng:77.6408, heat:5,
    blurb:"Café-strip energy, premium pricing, walkable lanes." },
  { id:"koramangala", name:"Koramangala", avgRent:42000, trend:+8.1, demand:"Very High",
    score:8.7, safety:8.3, connect:9.0, schools:8.7, amenity:9.3, noise:6.8,
    lat:12.9352, lng:77.6245, heat:4,
    blurb:"Startup-belt favorite, dense, well-connected." },
  { id:"hsr",  name:"HSR Layout", avgRent:38200, trend:+7.4, demand:"High",
    score:8.4, safety:8.7, connect:8.4, schools:8.5, amenity:8.8, noise:5.4,
    lat:12.9116, lng:77.6474, heat:3,
    blurb:"Grid-planned, family-friendly, calmer evenings." },
  { id:"bellandur", name:"Bellandur", avgRent:34500, trend:+6.0, demand:"High",
    score:7.9, safety:7.8, connect:7.6, schools:8.1, amenity:8.0, noise:6.1,
    lat:12.9304, lng:77.6784, heat:3,
    blurb:"Closer to ORR offices, lake views, traffic-heavy." },
  { id:"whitefield", name:"Whitefield", avgRent:31800, trend:+5.2, demand:"High",
    score:7.7, safety:8.0, connect:7.2, schools:8.6, amenity:8.3, noise:5.6,
    lat:12.9698, lng:77.7500, heat:2,
    blurb:"IT corridor classic, gated societies, school options." },
  { id:"marathahalli", name:"Marathahalli", avgRent:28500, trend:+4.1, demand:"Moderate",
    score:7.3, safety:7.4, connect:7.8, schools:7.6, amenity:7.9, noise:7.0,
    lat:12.9591, lng:77.6974, heat:2,
    blurb:"Commute-friendly, busy junctions, mid-range stock." },
  { id:"jpnagar", name:"JP Nagar", avgRent:30200, trend:+4.6, demand:"Moderate",
    score:7.8, safety:8.5, connect:7.4, schools:8.2, amenity:8.0, noise:4.8,
    lat:12.9081, lng:77.5831, heat:2,
    blurb:"Leafy, residential, slower pace, value picks." },
  { id:"sarjapur", name:"Sarjapur Road", avgRent:26800, trend:+3.5, demand:"Emerging",
    score:7.1, safety:7.6, connect:6.9, schools:7.4, amenity:7.2, noise:5.2,
    lat:12.9010, lng:77.6874, heat:1,
    blurb:"Newer towers, emerging amenities, longer commutes." },
];

export const findLocality = (id) => LOCALITIES.find((l) => l.id === id);
