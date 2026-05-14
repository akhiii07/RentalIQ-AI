export const SOCIETIES = [
  { id:"prestige-acropolis", name:"Prestige Acropolis", locality:"koramangala",
    units:240, age:8, maintenance:8.6, parking:"1 covered + visitor",
    parkingScore:8.4, noise:6.3, water:9.1, power:9.4, safety:8.8,
    sentiment:"Family-friendly", rentBand:[36000,46000], builderRating:9.0,
    tags:["Gated","Clubhouse","Pet-friendly","CCTV"] },
  { id:"sobha-meadows", name:"Sobha Meadows", locality:"hsr",
    units:180, age:6, maintenance:8.9, parking:"1 covered included",
    parkingScore:8.7, noise:5.2, water:9.3, power:9.5, safety:9.0,
    sentiment:"Quiet, professionals-heavy", rentBand:[34000,42000], builderRating:9.1,
    tags:["Gym","Pool","Power backup","No-broker"] },
  { id:"brigade-altamont", name:"Brigade Altamont", locality:"indiranagar",
    units:120, age:12, maintenance:7.6, parking:"1 open + extra ₹2.5k",
    parkingScore:6.8, noise:7.4, water:8.6, power:9.0, safety:8.2,
    sentiment:"Lively, mixed crowd", rentBand:[42000,55000], builderRating:8.2,
    tags:["Walkable","Metro nearby","Café strip"] },
  { id:"purva-skywood", name:"Purva Skywood", locality:"bellandur",
    units:320, age:4, maintenance:8.2, parking:"1 covered + bike slot",
    parkingScore:8.0, noise:6.5, water:8.4, power:9.2, safety:8.5,
    sentiment:"Young families, IT crowd", rentBand:[30000,40000], builderRating:8.6,
    tags:["Lake view","Clubhouse","Shuttle to ORR"] },
];

export const FOCUS_PROPERTY = {
  id:"pa-3bhk-401", society:"prestige-acropolis", bhk:3, size:1485, floor:4,
  totalFloors:11, furnishing:"Semi-furnished", facing:"East",
  age:8, deposit:10, listedRent:45000, occupiedSince:"2024-04",
};

export const findSocietyByLocality = (localityId) =>
  SOCIETIES.find((s) => s.locality === localityId);
