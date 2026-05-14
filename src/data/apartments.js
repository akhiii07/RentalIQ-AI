// Procedurally synthesized apartment data — 8-12 listings per locality,
// totalling ~200 entries. Seeded by locality id so the list is stable.

import { LOCALITIES } from "./localities";

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

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

const BUILDERS = [
  "Prestige", "Brigade", "Sobha", "Purva", "Salarpuria", "Mantri", "Adarsh",
  "RMZ", "Godrej", "Shriram", "Provident", "Embassy", "SNN", "Mahindra",
  "Tata", "L&T", "Goyal", "Concorde", "Century", "Total Environment", "Rohan",
];

const PROJECTS = [
  "Acropolis", "Meadows", "Altamont", "Skywood", "Pinnacle", "Heights",
  "Crown", "Greenage", "Royal Gardens", "Lakeshore", "Meridian", "Aspire",
  "Serenity", "Wisteria", "Vantage", "Trinity", "Hillside", "Highland",
  "Garden Vue", "Glade", "Westwood", "Aurum", "Boulevard", "Habitat",
  "Whisper Valley", "Emerald", "Sapphire", "Azure", "Riverdale", "Springs",
];

const FURNISHING = ["Unfurnished", "Semi-furnished", "Fully-furnished"];
const FACING = ["North", "South", "East", "West", "North-East", "South-East"];

const TAG_POOL = [
  "Gated", "Clubhouse", "Pool", "Gym", "Power backup", "Pet-friendly",
  "Park view", "Metro nearby", "No-broker", "Kids' play", "CCTV", "Lift",
  "Modular kitchen", "Borewell", "Rainwater harvesting",
];

const generateApartments = () => {
  const all = [];
  for (const loc of LOCALITIES) {
    const rng = mulberry32(hashCode(loc.id + "::apt"));
    const count = 8 + Math.floor(rng() * 5); // 8..12
    for (let i = 0; i < count; i++) {
      const bhk = rng() < 0.55 ? 3 : rng() < 0.85 ? 2 : 4;
      const baseSqft =
        bhk === 2 ? 950 + Math.floor(rng() * 350) :
        bhk === 3 ? 1320 + Math.floor(rng() * 560) :
                    1800 + Math.floor(rng() * 700);
      const rentMult = 0.78 + rng() * 0.45;
      const bhkMult = bhk === 2 ? 0.82 : bhk === 3 ? 1.0 : 1.28;
      const rent = Math.round((loc.avgRent * rentMult * bhkMult) / 500) * 500;

      // jittered lat/lng inside the polygon radius (~700 m)
      const angle = rng() * Math.PI * 2;
      const dist = Math.sqrt(rng()) * 0.0065;
      const lat = +(loc.lat + Math.sin(angle) * dist).toFixed(5);
      const lng = +(loc.lng + Math.cos(angle) * dist).toFixed(5);

      const tagCount = 2 + Math.floor(rng() * 3);
      const tags = [];
      while (tags.length < tagCount) {
        const t = pick(rng, TAG_POOL);
        if (!tags.includes(t)) tags.push(t);
      }

      all.push({
        id: `${loc.id}-apt-${i + 1}`,
        localityId: loc.id,
        name: `${pick(rng, BUILDERS)} ${pick(rng, PROJECTS)}`,
        bhk,
        sqft: baseSqft,
        rent,
        deposit: 8 + Math.floor(rng() * 4),
        age: 1 + Math.floor(rng() * 14),
        floor: 1 + Math.floor(rng() * 18),
        totalFloors: 12 + Math.floor(rng() * 18),
        furnishing: pick(rng, FURNISHING),
        facing: pick(rng, FACING),
        lat,
        lng,
        tags,
        verified: rng() < 0.7,
      });
    }
  }
  return all;
};

export const APARTMENTS = generateApartments();

export const findAptsInLocality = (localityId) =>
  APARTMENTS.filter((a) => a.localityId === localityId);

export const findApt = (id) => APARTMENTS.find((a) => a.id === id);
