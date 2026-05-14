import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, MapPin, TrendingUp, TrendingDown, Shield, Volume2, Droplet, Zap,
  Car, Trees, GraduationCap, ShoppingBag, Train, Sparkles, ChevronRight,
  ChevronLeft, X, Check, Info, AlertCircle, Star, Users, MessageCircle,
  Crosshair, Send, ArrowUp, ArrowDown, BadgeCheck, Lock, Plus, Minus,
  Building2, ArrowUpRight, Hash, Wind, Wrench, Filter, Eye, EyeOff
} from "lucide-react";

// =============================================================================
// THEME / TOKENS
// =============================================================================
const T = {
  paper: "#F4EFE6",
  paperDark: "#EDE6D6",
  card: "#FBF8F1",
  ink: "#1A1D1A",
  ink2: "#3E423C",
  ink3: "#6B6E66",
  ink4: "#9A9B92",
  divider: "#D8D2C5",
  emerald: "#0F4D3A",
  emerald2: "#1E6B52",
  clay: "#C8552E",
  clay2: "#A33F1E",
  mustard: "#C99A2E",
  sky: "#3B6E8F",
  // heatmap (low→high)
  heat: ["#F3DCC4", "#EFCBA9", "#E6A984", "#D88660", "#C8552E", "#A33F1E"],
};

// =============================================================================
// MOCK DATA
// =============================================================================
const LOCALITIES = [
  { id:"indiranagar", name:"Indiranagar", avgRent:46500, trend:+9.2, demand:"Very High",
    score:9.1, safety:8.6, connect:9.4, schools:8.9, amenity:9.5, noise:6.4,
    cx:560, cy:160, w:140, h:90, label:{dx:0,dy:-58}, heat:5,
    blurb:"Café-strip energy, premium pricing, walkable lanes." },
  { id:"koramangala", name:"Koramangala", avgRent:42000, trend:+8.1, demand:"Very High",
    score:8.7, safety:8.3, connect:9.0, schools:8.7, amenity:9.3, noise:6.8,
    cx:430, cy:300, w:160, h:110, label:{dx:0,dy:-70}, heat:4,
    blurb:"Startup-belt favorite, dense, well-connected." },
  { id:"hsr",  name:"HSR Layout", avgRent:38200, trend:+7.4, demand:"High",
    score:8.4, safety:8.7, connect:8.4, schools:8.5, amenity:8.8, noise:5.4,
    cx:520, cy:430, w:150, h:100, label:{dx:0,dy:64}, heat:3,
    blurb:"Grid-planned, family-friendly, calmer evenings." },
  { id:"bellandur", name:"Bellandur", avgRent:34500, trend:+6.0, demand:"High",
    score:7.9, safety:7.8, connect:7.6, schools:8.1, amenity:8.0, noise:6.1,
    cx:670, cy:340, w:120, h:90, label:{dx:0,dy:-58}, heat:3,
    blurb:"Closer to ORR offices, lake views, traffic-heavy." },
  { id:"whitefield", name:"Whitefield", avgRent:31800, trend:+5.2, demand:"High",
    score:7.7, safety:8.0, connect:7.2, schools:8.6, amenity:8.3, noise:5.6,
    cx:840, cy:240, w:140, h:110, label:{dx:0,dy:-68}, heat:2,
    blurb:"IT corridor classic, gated societies, school options." },
  { id:"marathahalli", name:"Marathahalli", avgRent:28500, trend:+4.1, demand:"Moderate",
    score:7.3, safety:7.4, connect:7.8, schools:7.6, amenity:7.9, noise:7.0,
    cx:720, cy:200, w:110, h:80, label:{dx:0,dy:-50}, heat:2,
    blurb:"Commute-friendly, busy junctions, mid-range stock." },
  { id:"jpnagar", name:"JP Nagar", avgRent:30200, trend:+4.6, demand:"Moderate",
    score:7.8, safety:8.5, connect:7.4, schools:8.2, amenity:8.0, noise:4.8,
    cx:300, cy:460, w:140, h:100, label:{dx:0,dy:62}, heat:2,
    blurb:"Leafy, residential, slower pace, value picks." },
  { id:"sarjapur", name:"Sarjapur Road", avgRent:26800, trend:+3.5, demand:"Emerging",
    score:7.1, safety:7.6, connect:6.9, schools:7.4, amenity:7.2, noise:5.2,
    cx:700, cy:490, w:170, h:90, label:{dx:0,dy:60}, heat:1,
    blurb:"Newer towers, emerging amenities, longer commutes." },
];

const SOCIETIES = [
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

// Property of focus (used in pricing flow)
const FOCUS_PROPERTY = {
  id:"pa-3bhk-401", society:"prestige-acropolis", bhk:3, size:1485, floor:4,
  totalFloors:11, furnishing:"Semi-furnished", facing:"East",
  age:8, deposit:10, listedRent:45000, occupiedSince:"2024-04",
};

const COMPARABLES_SEED = [
  { id:"c1", name:"Prestige Acropolis · 3BHK", floor:6, size:1520, rent:46000, dist:0.0, similarity:0.96, active:true, age:8 },
  { id:"c2", name:"Sobha Meadows · 3BHK", floor:3, size:1460, rent:41500, dist:2.4, similarity:0.88, active:true, age:6 },
  { id:"c3", name:"Purva Skywood · 3BHK", floor:9, size:1510, rent:39800, dist:5.1, similarity:0.81, active:true, age:4 },
  { id:"c4", name:"Brigade Altamont · 3BHK", floor:5, size:1430, rent:48500, dist:3.6, similarity:0.74, active:true, age:12 },
  { id:"c5", name:"Salarpuria Greenage · 3BHK", floor:7, size:1500, rent:43000, dist:1.8, similarity:0.91, active:true, age:9 },
  { id:"c6", name:"Mantri Espana · 3BHK", floor:11, size:1620, rent:52000, dist:6.2, similarity:0.69, active:true, age:7 },
  { id:"c7", name:"DSR Eden Garden · 3BHK", floor:2, size:1380, rent:36500, dist:4.0, similarity:0.78, active:true, age:14 },
];

const QUESTIONS_SEED = [
  { q:"How noisy is the area at night?", responses:34, sentiment:"positive",
    summary:"Mostly quiet past 10 PM. Some honks on main road; interior blocks are calm.",
    voices:[{badge:"resident", t:"I've lived in C-block 3 yrs — sleep with windows open."},
            {badge:"visitor", t:"Outer ring units catch some traffic noise."}] },
  { q:"Is parking actually included?", responses:21, sentiment:"neutral",
    summary:"1 covered slot per unit included. Second car ₹2,500/mo, often waitlisted.",
    voices:[{badge:"resident", t:"Two-wheeler parking is generous, cars need patience."}] },
  { q:"How reliable is water supply?", responses:28, sentiment:"positive",
    summary:"Borewell + Cauvery. No shortages reported in last 8 months.",
    voices:[{badge:"resident", t:"Tanker called twice in summer 2024, both times same-day."}] },
  { q:"How family-friendly is the society?", responses:41, sentiment:"positive",
    summary:"Active kids' play area, weekend events, school-run carpools common.",
    voices:[{badge:"resident", t:"Diwali, Onam, Christmas all celebrated at clubhouse."}] },
  { q:"How responsive is maintenance?", responses:19, sentiment:"neutral",
    summary:"Same-day for plumbing/electrical. Civil work takes 3–5 days.",
    voices:[{badge:"resident", t:"App-based ticketing works. Older lifts get patchy fixes."}] },
  { q:"Pet-friendly in practice?", responses:14, sentiment:"positive",
    summary:"Dogs allowed; designated walking lawn. Cats in 30%+ flats.",
    voices:[{badge:"resident", t:"Two German Shepherds on our floor, no issues."}] },
];

const REVIEWS_SEED = [
  { id:"r1", badge:"resident", who:"Aarav · 2.5 yrs in B-block", when:"3 weeks ago",
    score:4.5, body:"Maintenance team is genuinely responsive. Building is aging gracefully — small things like paint in stairwells could be better, but the essentials (water, power, safety) are dependable.",
    tags:["water","maintenance","safety"], weight:1.0 },
  { id:"r2", badge:"visitor", who:"GPS verified · Visited 11 May", when:"3 days ago",
    score:4.0, body:"Toured 3BHK on 6th floor. Lift wait was real at 9 AM. Views compensate. Negotiate parking up-front.",
    tags:["parking","commute"], weight:0.6 },
  { id:"r3", badge:"resident", who:"Meera · 5 yrs in A-block", when:"2 months ago",
    score:4.2, body:"Society culture is the actual product here. WhatsApp groups are well-moderated. Kids' programs in summer are excellent. Pricing has climbed faster than amenities, honestly.",
    tags:["community","pricing"], weight:0.85 },
  { id:"r4", badge:"anon", who:"Anonymous", when:"4 months ago",
    score:3.5, body:"Decent place but not worth top-of-band rent. Negotiate.",
    tags:["pricing"], weight:0.25 },
];

// =============================================================================
// HELPERS
// =============================================================================
const fmtINR = (n) => "₹" + n.toLocaleString("en-IN");
const fmtINRk = (n) => "₹" + (n/1000).toFixed(n%1000===0?0:1) + "K";

function median(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a,b)=>a-b);
  const m = Math.floor(s.length/2);
  return s.length%2 ? s[m] : (s[m-1]+s[m])/2;
}

// AI price computation — explainable, deterministic
function computeAIPrice(property, comparables, factors) {
  const active = comparables.filter(c=>c.active);
  if (!active.length) return { price:0, low:0, high:0, base:0, factorDeltas:[], confidence:0 };
  // base: weighted by similarity, per-sqft median * size
  const weighted = active.map(c => ({ psf: c.rent/c.size, w: c.similarity }));
  const wsum = weighted.reduce((a,b)=>a+b.w,0);
  const psf = weighted.reduce((a,b)=>a + b.psf*b.w, 0) / wsum;
  const base = psf * property.size;

  // factor adjustments — each returns delta in absolute INR
  const deltas = [];
  const schoolDelta = base * ((factors.schools - 7.5) * 0.018);
  deltas.push({ k:"School quality", v:schoolDelta, score:factors.schools, icon:GraduationCap });
  const connDelta = base * ((factors.connect - 7.5) * 0.020);
  deltas.push({ k:"Connectivity & transit", v:connDelta, score:factors.connect, icon:Train });
  const safetyDelta = base * ((factors.safety - 7.5) * 0.014);
  deltas.push({ k:"Safety perception", v:safetyDelta, score:factors.safety, icon:Shield });
  const noiseDelta = base * (-(factors.noise - 5.5) * 0.012);
  deltas.push({ k:"Ambient noise (penalty)", v:noiseDelta, score:factors.noise, icon:Volume2, inverted:true });
  const parkDelta = base * ((factors.parking - 7) * 0.012);
  deltas.push({ k:"Parking availability", v:parkDelta, score:factors.parking, icon:Car });
  const maintDelta = base * ((factors.maintenance - 7.5) * 0.013);
  deltas.push({ k:"Maintenance quality", v:maintDelta, score:factors.maintenance, icon:Wrench });

  const adjusted = base + deltas.reduce((a,b)=>a+b.v,0);
  // confidence shrinks with fewer comparables and lower avg similarity
  const avgSim = active.reduce((a,b)=>a+b.similarity,0)/active.length;
  const spread = Math.max(0.05, 0.16 - avgSim*0.10 - Math.min(active.length,7)*0.005);
  const final = Math.round(adjusted/500)*500;
  return {
    price: final,
    low: Math.round(final*(1-spread)/500)*500,
    high: Math.round(final*(1+spread)/500)*500,
    base: Math.round(base),
    factorDeltas: deltas,
    confidence: Math.round((1-spread)*100),
    spread,
  };
}

// =============================================================================
// MAP — stylized SVG cartography of Bengaluru localities
// =============================================================================
function CityMap({ selected, onSelect, hoverId, setHoverId, mode }) {
  return (
    <svg viewBox="0 0 1000 640" className="w-full h-full" style={{ display:"block" }}>
      <defs>
        <pattern id="paperGrain" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.5" fill="#000" opacity="0.025"/>
        </pattern>
        <pattern id="hatch" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={T.ink} strokeWidth="0.6" opacity="0.08"/>
        </pattern>
        <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
          <stop offset="60%" stopColor={T.paper} stopOpacity="0"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.08"/>
        </radialGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dy="2"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.15"/></feComponentTransfer>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* paper background */}
      <rect width="1000" height="640" fill={T.paper}/>
      <rect width="1000" height="640" fill="url(#paperGrain)"/>

      {/* faint contour lines suggesting topography */}
      <g opacity="0.18" stroke={T.ink3} fill="none" strokeWidth="0.5">
        <path d="M -50 200 Q 250 140, 500 220 T 1050 180"/>
        <path d="M -50 260 Q 250 200, 500 280 T 1050 240"/>
        <path d="M -50 380 Q 250 320, 500 400 T 1050 360"/>
        <path d="M -50 460 Q 250 400, 500 480 T 1050 440"/>
      </g>

      {/* lake polygons (Bellandur, Agara hint) */}
      <g opacity="0.55">
        <path d="M 650 400 Q 720 380, 780 410 Q 800 440, 760 470 Q 700 480, 640 460 Q 620 430, 650 400 Z"
              fill={T.sky} opacity="0.35"/>
        <path d="M 460 420 Q 510 410, 540 430 Q 540 450, 500 460 Q 460 455, 450 440 Z"
              fill={T.sky} opacity="0.3"/>
      </g>

      {/* major roads */}
      <g stroke={T.ink2} strokeWidth="1.2" fill="none" opacity="0.35" strokeLinecap="round">
        {/* outer ring road - elliptical */}
        <ellipse cx="540" cy="320" rx="380" ry="240" strokeDasharray="2 3" opacity="0.45"/>
        {/* old madras road horizontal */}
        <path d="M 100 200 Q 400 180, 700 200 T 980 220"/>
        {/* 100ft road (indiranagar->koramangala->hsr) */}
        <path d="M 560 180 Q 500 240, 460 300 Q 480 380, 520 440"/>
        {/* sarjapur road */}
        <path d="M 460 320 Q 600 380, 750 470"/>
        {/* whitefield connector */}
        <path d="M 600 280 Q 720 240, 850 240"/>
      </g>

      {/* metro line */}
      <g stroke={T.clay} strokeWidth="1.8" fill="none" opacity="0.55" strokeDasharray="6 4">
        <path d="M 120 160 Q 380 160, 580 180 Q 750 210, 880 240"/>
      </g>

      {/* localities */}
      {LOCALITIES.map(loc => {
        const isSel = selected===loc.id;
        const isHover = hoverId===loc.id;
        const fill = T.heat[loc.heat];
        return (
          <g key={loc.id}
             onClick={()=>onSelect(loc.id)}
             onMouseEnter={()=>setHoverId(loc.id)}
             onMouseLeave={()=>setHoverId(null)}
             style={{ cursor:"pointer" }}>
            <rect x={loc.cx-loc.w/2} y={loc.cy-loc.h/2}
                  width={loc.w} height={loc.h} rx="14"
                  fill={fill}
                  stroke={isSel?T.ink:T.ink2}
                  strokeWidth={isSel?2.2:1}
                  opacity={isHover||isSel?1:0.92}
                  style={{ transition:"all 200ms" }}/>
            {/* hatch overlay on hover/select */}
            {(isHover||isSel) && (
              <rect x={loc.cx-loc.w/2} y={loc.cy-loc.h/2}
                    width={loc.w} height={loc.h} rx="14"
                    fill="url(#hatch)" pointerEvents="none"/>
            )}
            {/* center dot */}
            <circle cx={loc.cx} cy={loc.cy} r="3" fill={T.ink}/>
            {/* label */}
            <g transform={`translate(${loc.cx+loc.label.dx}, ${loc.cy+loc.label.dy})`}>
              <text textAnchor="middle" fontFamily="Fraunces, serif" fontSize="17"
                    fontWeight="500" fill={T.ink} letterSpacing="0.3">
                {loc.name}
              </text>
              <text y="16" textAnchor="middle" fontFamily="JetBrains Mono, monospace"
                    fontSize="11" fill={T.ink2} letterSpacing="0.5">
                {fmtINRk(loc.avgRent)} · {loc.trend>0?"↑":"↓"}{Math.abs(loc.trend).toFixed(1)}%
              </text>
            </g>
          </g>
        );
      })}

      {/* compass rose */}
      <g transform="translate(930, 540)" opacity="0.7">
        <circle r="22" fill="none" stroke={T.ink2} strokeWidth="0.8"/>
        <path d="M 0 -18 L 4 0 L 0 18 L -4 0 Z" fill={T.ink}/>
        <text y="-26" textAnchor="middle" fontFamily="Fraunces, serif"
              fontSize="11" fill={T.ink}>N</text>
      </g>

      {/* scale bar */}
      <g transform="translate(40, 600)" fill={T.ink2}>
        <line x1="0" y1="0" x2="80" y2="0" stroke={T.ink2} strokeWidth="1"/>
        <line x1="0" y1="-3" x2="0" y2="3" stroke={T.ink2} strokeWidth="1"/>
        <line x1="40" y1="-2" x2="40" y2="2" stroke={T.ink2} strokeWidth="1"/>
        <line x1="80" y1="-3" x2="80" y2="3" stroke={T.ink2} strokeWidth="1"/>
        <text y="16" fontFamily="JetBrains Mono, monospace" fontSize="9">0</text>
        <text x="80" y="16" fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="end">~2 km</text>
      </g>

      <rect width="1000" height="640" fill="url(#vignette)" pointerEvents="none"/>
    </svg>
  );
}

// =============================================================================
// SMALL UI COMPONENTS
// =============================================================================
function Pill({ children, tone="default", icon:Icon }) {
  const styles = {
    default: { bg:"#EDE6D6", fg:T.ink2, border:T.divider },
    emerald: { bg:"#E2EDDE", fg:T.emerald, border:"#B7CDB1" },
    clay:    { bg:"#F3DCC4", fg:T.clay2, border:"#E5BFA0" },
    ink:     { bg:T.ink, fg:T.paper, border:T.ink },
    mustard: { bg:"#F4E5BC", fg:"#7A5D14", border:"#DEC68C" },
  };
  const s = styles[tone] || styles.default;
  return (
    <span style={{
      background:s.bg, color:s.fg, border:`1px solid ${s.border}`,
      fontFamily:"DM Sans, sans-serif", fontSize:11, fontWeight:500,
      padding:"3px 9px", borderRadius:999, display:"inline-flex",
      alignItems:"center", gap:5, letterSpacing:0.2, whiteSpace:"nowrap"
    }}>
      {Icon && <Icon size={11} strokeWidth={2}/>}
      {children}
    </span>
  );
}

function Stat({ label, value, sub, mono=true }) {
  return (
    <div style={{ padding:"10px 0" }}>
      <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10.5,
        textTransform:"uppercase", letterSpacing:1.3, color:T.ink3, fontWeight:500 }}>
        {label}
      </div>
      <div style={{ fontFamily: mono?"JetBrains Mono, monospace":"Fraunces, serif",
        fontSize:21, fontWeight:500, color:T.ink, marginTop:3 }}>{value}</div>
      {sub && <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:11.5,
        color:T.ink3, marginTop:2 }}>{sub}</div>}
    </div>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"6px 0" }}>
      <div style={{ flex:1, height:1, background:T.divider }}/>
      {label && <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
        letterSpacing:1.5, textTransform:"uppercase", color:T.ink4 }}>{label}</div>}
      {label && <div style={{ flex:1, height:1, background:T.divider }}/>}
    </div>
  );
}

function ScoreBar({ score, max=10, color=T.emerald }) {
  return (
    <div style={{ position:"relative", height:6, background:"#E5DEC9", borderRadius:99 }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0,
        width:`${(score/max)*100}%`, background:color, borderRadius:99,
        transition:"width 400ms" }}/>
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={onChange} style={{
      width:34, height:18, borderRadius:99, background: on?T.emerald:"#C8C2B0",
      position:"relative", border:"none", cursor:"pointer", transition:"all 200ms"
    }}>
      <span style={{ position:"absolute", top:2, left: on?18:2, width:14, height:14,
        background:T.paper, borderRadius:99, transition:"left 200ms",
        boxShadow:"0 1px 2px rgba(0,0,0,0.2)" }}/>
    </button>
  );
}

// Legend for the map
function HeatLegend() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
        textTransform:"uppercase", letterSpacing:1.4, color:T.ink3 }}>Avg rent</span>
      <div style={{ display:"flex", gap:2 }}>
        {T.heat.map((c,i)=>(
          <div key={i} style={{ width:18, height:8, background:c, borderRadius:2 }}/>
        ))}
      </div>
      <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:10, color:T.ink2 }}>
        ₹22K → ₹48K
      </span>
    </div>
  );
}

// =============================================================================
// EXPLORE VIEW (map-first)
// =============================================================================
function ExploreView({ onSelectLocality }) {
  const [hoverId, setHoverId] = useState(null);
  const [selected, setSelected] = useState(null);
  const activeLoc = LOCALITIES.find(l => l.id===(hoverId||selected||"koramangala"));

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:20, height:"100%" }}>
      {/* MAP CANVAS */}
      <div style={{ background:T.card, border:`1px solid ${T.divider}`, borderRadius:14,
        overflow:"hidden", position:"relative", boxShadow:"0 1px 0 rgba(0,0,0,0.02)" }}>
        {/* map header strip */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"14px 18px", borderBottom:`1px solid ${T.divider}` }}>
          <div>
            <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
              textTransform:"uppercase", letterSpacing:1.6, color:T.ink3 }}>
              Atlas · Sheet 01
            </div>
            <div style={{ fontFamily:"Fraunces, serif", fontSize:22, fontWeight:400,
              color:T.ink, marginTop:1 }}>
              Bengaluru — South & East Rental Belt
            </div>
          </div>
          <HeatLegend/>
        </div>
        {/* map */}
        <div style={{ position:"relative", paddingBottom:"60%" }}>
          <div style={{ position:"absolute", inset:0 }}>
            <CityMap selected={selected} onSelect={onSelectLocality}
                     hoverId={hoverId} setHoverId={setHoverId} mode="explore"/>
          </div>
        </div>
        {/* footer key */}
        <div style={{ display:"flex", gap:18, padding:"12px 18px",
          borderTop:`1px solid ${T.divider}`, fontFamily:"DM Sans, sans-serif",
          fontSize:11, color:T.ink3 }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
            <span style={{ width:14, height:2, background:T.clay, opacity:0.6,
              borderTop:`1px dashed ${T.clay}` }}/>Metro line
          </span>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
            <span style={{ width:14, height:2, borderTop:`1px dashed ${T.ink2}` }}/>Outer Ring Road
          </span>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
            <span style={{ width:10, height:6, background:T.sky, opacity:0.4,
              borderRadius:2 }}/>Lake
          </span>
          <span style={{ marginLeft:"auto", fontFamily:"JetBrains Mono, monospace" }}>
            Updated 14 May · 8,412 verified data points
          </span>
        </div>
      </div>

      {/* RIGHT INTEL PANEL */}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {/* Active locality readout */}
        <div style={{ background:T.card, border:`1px solid ${T.divider}`, borderRadius:14,
          padding:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
            <div>
              <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
                textTransform:"uppercase", letterSpacing:1.4, color:T.ink3 }}>
                Locality Read · {hoverId?"Hover":"Default"}
              </div>
              <div style={{ fontFamily:"Fraunces, serif", fontSize:28, fontWeight:400,
                color:T.ink, marginTop:2, lineHeight:1.1 }}>
                {activeLoc.name}
              </div>
            </div>
            <Pill tone={activeLoc.demand==="Very High"?"clay":activeLoc.demand==="High"?"mustard":"emerald"}>
              {activeLoc.demand}
            </Pill>
          </div>
          <div style={{ fontFamily:"Fraunces, serif", fontStyle:"italic", fontSize:13,
            color:T.ink3, marginTop:6, lineHeight:1.5 }}>
            "{activeLoc.blurb}"
          </div>

          <Divider/>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
            <Stat label="Avg 3BHK rent" value={fmtINR(activeLoc.avgRent)}
                  sub={`${activeLoc.trend>0?"↑":"↓"} ${Math.abs(activeLoc.trend)}% YoY`}/>
            <Stat label="Locality score" value={activeLoc.score+" / 10"}
                  sub="Weighted index"/>
          </div>

          <div style={{ marginTop:10 }}>
            {[
              { k:"Safety", v:activeLoc.safety, icon:Shield },
              { k:"Connectivity", v:activeLoc.connect, icon:Train },
              { k:"Schools", v:activeLoc.schools, icon:GraduationCap },
              { k:"Amenities", v:activeLoc.amenity, icon:ShoppingBag },
              { k:"Noise (lower=quieter)", v:activeLoc.noise, icon:Volume2, inverted:true },
            ].map(row => (
              <div key={row.k} style={{ display:"grid",
                gridTemplateColumns:"22px 1fr 80px 36px", alignItems:"center",
                gap:10, padding:"6px 0" }}>
                <row.icon size={14} color={T.ink3} strokeWidth={1.6}/>
                <span style={{ fontFamily:"DM Sans, sans-serif", fontSize:12, color:T.ink2 }}>
                  {row.k}
                </span>
                <ScoreBar score={row.v} color={row.inverted?T.clay:T.emerald}/>
                <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:11,
                  color:T.ink, textAlign:"right" }}>{row.v.toFixed(1)}</span>
              </div>
            ))}
          </div>

          <button onClick={()=>onSelectLocality(activeLoc.id)} style={{
            marginTop:12, width:"100%", padding:"11px 14px", border:"none",
            background:T.ink, color:T.paper, borderRadius:10, cursor:"pointer",
            fontFamily:"DM Sans, sans-serif", fontSize:13, fontWeight:500,
            display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7
          }}>
            Drill into {activeLoc.name}
            <ChevronRight size={15} strokeWidth={2}/>
          </button>
        </div>

        {/* Demand pulse */}
        <div style={{ background:T.card, border:`1px solid ${T.divider}`, borderRadius:14,
          padding:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
              textTransform:"uppercase", letterSpacing:1.4, color:T.ink3 }}>
              Demand pulse · last 30d
            </div>
            <Pill icon={Sparkles}>AI ranked</Pill>
          </div>
          <div style={{ marginTop:10 }}>
            {[...LOCALITIES].sort((a,b)=>b.trend-a.trend).slice(0,5).map((l,i)=>(
              <div key={l.id} onClick={()=>onSelectLocality(l.id)}
                   style={{ display:"grid", gridTemplateColumns:"18px 1fr auto auto",
                     alignItems:"center", gap:10, padding:"7px 0",
                     borderBottom: i<4?`1px dashed ${T.divider}`:"none", cursor:"pointer" }}>
                <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:10,
                  color:T.ink4 }}>0{i+1}</span>
                <span style={{ fontFamily:"Fraunces, serif", fontSize:14, color:T.ink }}>
                  {l.name}
                </span>
                <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:11,
                  color:T.ink2 }}>{fmtINRk(l.avgRent)}</span>
                <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:11,
                  color: l.trend>5?T.clay:T.emerald, display:"inline-flex",
                  alignItems:"center", gap:2, width:42, justifyContent:"flex-end" }}>
                  {l.trend>0?<ArrowUp size={10}/>:<ArrowDown size={10}/>}
                  {Math.abs(l.trend).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// =============================================================================
// SOCIETY VIEW
// =============================================================================
function SocietyTabs({ tab, onTab }) {
  const tabs = ["Overview","Ask Neighbor","Verified Reviews","Pricing"];
  return (
    <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${T.divider}`,
      marginBottom:18 }}>
      {tabs.map(t=>(
        <button key={t} onClick={()=>onTab(t)} style={{
          background:"transparent", border:"none", cursor:"pointer",
          padding:"12px 18px", marginBottom:-1,
          fontFamily:"DM Sans, sans-serif", fontSize:13,
          color: tab===t?T.ink:T.ink3,
          borderBottom: tab===t?`2px solid ${T.ink}`:"2px solid transparent",
          fontWeight: tab===t?600:400,
        }}>{t}</button>
      ))}
    </div>
  );
}

function FactorTile({ icon:Icon, label, value, score, tone=T.emerald, sub }) {
  return (
    <div style={{ background:T.card, border:`1px solid ${T.divider}`, borderRadius:12,
      padding:14, position:"relative" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <Icon size={16} color={T.ink3} strokeWidth={1.6}/>
        {score !== undefined && (
          <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:11,
            color: tone, fontWeight:500 }}>{score}/10</span>
        )}
      </div>
      <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
        textTransform:"uppercase", letterSpacing:1.3, color:T.ink3, marginTop:8 }}>
        {label}
      </div>
      <div style={{ fontFamily:"Fraunces, serif", fontSize:16, color:T.ink, marginTop:2,
        lineHeight:1.3 }}>{value}</div>
      {sub && (
        <div style={{ marginTop:8 }}>
          <ScoreBar score={score} color={tone}/>
        </div>
      )}
    </div>
  );
}

function QACard({ q, idx }) {
  const [open, setOpen] = useState(idx===0);
  const tone = q.sentiment==="positive"?T.emerald : q.sentiment==="negative"?T.clay : T.ink3;
  return (
    <div style={{ background:T.card, border:`1px solid ${T.divider}`, borderRadius:12,
      padding:16, marginBottom:10 }}>
      <div onClick={()=>setOpen(!open)} style={{ display:"flex",
        justifyContent:"space-between", alignItems:"center", cursor:"pointer", gap:14 }}>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start", flex:1 }}>
          <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:10,
            color:T.ink4, paddingTop:4 }}>Q{String(idx+1).padStart(2,"0")}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"Fraunces, serif", fontSize:17,
              color:T.ink, lineHeight:1.35 }}>{q.q}</div>
            <div style={{ display:"flex", gap:8, marginTop:6, alignItems:"center" }}>
              <Pill tone={q.sentiment==="positive"?"emerald":q.sentiment==="negative"?"clay":"default"}>
                {q.sentiment}
              </Pill>
              <span style={{ fontFamily:"DM Sans, sans-serif", fontSize:11, color:T.ink3 }}>
                {q.responses} verified responses
              </span>
            </div>
          </div>
        </div>
        <div style={{ transform: open?"rotate(90deg)":"rotate(0deg)", transition:"transform 200ms" }}>
          <ChevronRight size={16} color={T.ink3}/>
        </div>
      </div>
      {open && (
        <div style={{ marginTop:14, paddingTop:14, borderTop:`1px dashed ${T.divider}` }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:3, alignSelf:"stretch", background:tone, borderRadius:2 }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
                textTransform:"uppercase", letterSpacing:1.4, color:T.ink3 }}>
                AI-summarized from {q.responses} responses
              </div>
              <div style={{ fontFamily:"Fraunces, serif", fontStyle:"italic",
                fontSize:15, color:T.ink, marginTop:4, lineHeight:1.55 }}>
                "{q.summary}"
              </div>
            </div>
          </div>
          <div style={{ marginTop:14 }}>
            <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
              textTransform:"uppercase", letterSpacing:1.4, color:T.ink3, marginBottom:8 }}>
              Sample voices
            </div>
            {q.voices.map((v,i)=>(
              <div key={i} style={{ display:"flex", gap:10, padding:"8px 0",
                borderTop: i>0?`1px dashed ${T.divider}`:"none" }}>
                <Pill tone={v.badge==="resident"?"emerald":"default"} icon={v.badge==="resident"?BadgeCheck:Eye}>
                  {v.badge==="resident"?"Verified resident":"GPS visitor"}
                </Pill>
                <span style={{ fontFamily:"Fraunces, serif", fontSize:13.5,
                  fontStyle:"italic", color:T.ink2, flex:1, lineHeight:1.4 }}>
                  "{v.t}"
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ r }) {
  const badgeMeta = {
    resident: { label:"Verified resident", tone:"emerald", icon:BadgeCheck, weight:"1.0×" },
    visitor:  { label:"GPS verified visitor", tone:"mustard", icon:Crosshair, weight:"0.6×" },
    anon:     { label:"Anonymous", tone:"default", icon:Lock, weight:"0.25×" },
  };
  const m = badgeMeta[r.badge];
  return (
    <div style={{ background:T.card, border:`1px solid ${T.divider}`, borderRadius:12,
      padding:16, marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"flex-start", gap:10 }}>
        <div>
          <Pill tone={m.tone} icon={m.icon}>{m.label}</Pill>
          <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:12,
            color:T.ink2, marginTop:8 }}>{r.who}</div>
          <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:11,
            color:T.ink3, marginTop:1 }}>{r.when} · trust weight {m.weight}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:18,
            color:T.ink, fontWeight:500 }}>{r.score.toFixed(1)}</div>
          <div style={{ display:"inline-flex", gap:1, marginTop:1 }}>
            {[1,2,3,4,5].map(i=>(
              <Star key={i} size={10}
                fill={i<=Math.round(r.score)?T.mustard:"transparent"}
                color={i<=Math.round(r.score)?T.mustard:T.divider}
                strokeWidth={1.5}/>
            ))}
          </div>
        </div>
      </div>
      <div style={{ fontFamily:"Fraunces, serif", fontSize:14.5, color:T.ink,
        marginTop:12, lineHeight:1.55 }}>
        {r.body}
      </div>
      <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
        {r.tags.map(t=><Pill key={t}>{t}</Pill>)}
      </div>
    </div>
  );
}

function SocietyView({ society, onBack, onPricing, onAddReview }) {
  const [tab, setTab] = useState("Overview");
  const loc = LOCALITIES.find(l=>l.id===society.locality);

  return (
    <div>
      {/* breadcrumb + header */}
      <div style={{ display:"flex", alignItems:"center", gap:8,
        fontFamily:"DM Sans, sans-serif", fontSize:11, color:T.ink3,
        textTransform:"uppercase", letterSpacing:1.3 }}>
        <button onClick={onBack} style={{ background:"none", border:"none",
          cursor:"pointer", color:T.ink3, padding:0, display:"inline-flex",
          gap:5, alignItems:"center" }}>
          <ChevronLeft size={13}/> Atlas
        </button>
        <span>/</span><span>{loc.name}</span><span>/</span>
        <span style={{ color:T.ink }}>{society.name}</span>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"flex-end", marginTop:12, gap:20 }}>
        <div>
          <Pill tone="default">Society profile</Pill>
          <h1 style={{ fontFamily:"Fraunces, serif", fontSize:44, fontWeight:400,
            color:T.ink, margin:"6px 0 4px", letterSpacing:-0.5, lineHeight:1.05 }}>
            {society.name}
          </h1>
          <div style={{ display:"flex", gap:14, alignItems:"center",
            fontFamily:"DM Sans, sans-serif", fontSize:13, color:T.ink2 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
              <MapPin size={13}/> {loc.name}, Bengaluru
            </span>
            <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
              <Building2 size={13}/> {society.units} units · {society.age} yrs
            </span>
          </div>
          <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
            {society.tags.map(t=><Pill key={t}>{t}</Pill>)}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
            textTransform:"uppercase", letterSpacing:1.4, color:T.ink3 }}>
            3BHK rent band
          </div>
          <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:24,
            color:T.ink, fontWeight:500, marginTop:2 }}>
            {fmtINRk(society.rentBand[0])} – {fmtINRk(society.rentBand[1])}
          </div>
          <button onClick={onPricing} style={{
            marginTop:10, padding:"10px 16px", border:"none",
            background:T.emerald, color:T.paper, borderRadius:10, cursor:"pointer",
            fontFamily:"DM Sans, sans-serif", fontSize:13, fontWeight:500,
            display:"inline-flex", alignItems:"center", gap:7
          }}>
            <Sparkles size={14}/> Run AI Pricing
          </button>
        </div>
      </div>

      <div style={{ marginTop:22 }}>
        <SocietyTabs tab={tab} onTab={setTab}/>
      </div>

      {tab==="Overview" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12 }}>
            <FactorTile icon={Wrench} label="Maintenance" value="Responsive · app-based"
              score={society.maintenance} tone={T.emerald} sub/>
            <FactorTile icon={Car} label="Parking" value={society.parking}
              score={society.parkingScore} tone={T.emerald} sub/>
            <FactorTile icon={Droplet} label="Water reliability" value="Borewell + Cauvery"
              score={society.water} tone={T.emerald} sub/>
            <FactorTile icon={Zap} label="Power backup" value="100% common, 80% homes"
              score={society.power} tone={T.emerald} sub/>
            <FactorTile icon={Volume2} label="Noise (interior)" value="Calm past 10 PM"
              score={society.noise} tone={T.clay} sub/>
            <FactorTile icon={Shield} label="Safety" value="24×7 guards · biometric"
              score={society.safety} tone={T.emerald} sub/>
            <FactorTile icon={Users} label="Neighborhood" value={society.sentiment}/>
            <FactorTile icon={Star} label="Builder rating" value="Long-tenure builder"
              score={society.builderRating} tone={T.emerald} sub/>
          </div>

          <div style={{ marginTop:24, background:T.card,
            border:`1px solid ${T.divider}`, borderRadius:14, padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:14 }}>
              <div>
                <Pill icon={Sparkles}>AI synthesis</Pill>
                <div style={{ fontFamily:"Fraunces, serif", fontSize:20, color:T.ink,
                  marginTop:8 }}>What residents consistently agree on</div>
              </div>
              <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:10,
                color:T.ink3 }}>Across 198 verified inputs</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
                  textTransform:"uppercase", letterSpacing:1.4, color:T.emerald }}>
                  Strengths
                </div>
                {["Water & power are not a daily worry",
                  "Maintenance team responds same-day",
                  "Family culture is active and welcoming",
                  "Walkable to 100ft Road cafés and metro"].map((s,i)=>(
                  <div key={i} style={{ display:"flex", gap:8, marginTop:8,
                    fontFamily:"Fraunces, serif", fontSize:14, color:T.ink2, lineHeight:1.45 }}>
                    <Check size={14} color={T.emerald} style={{flexShrink:0, marginTop:3}}/>
                    {s}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
                  textTransform:"uppercase", letterSpacing:1.4, color:T.clay }}>
                  Friction points
                </div>
                {["Second-car parking is waitlisted",
                  "Outer-block units catch some road noise",
                  "Older lifts get patchy fixes",
                  "Rents have outpaced amenity upgrades"].map((s,i)=>(
                  <div key={i} style={{ display:"flex", gap:8, marginTop:8,
                    fontFamily:"Fraunces, serif", fontSize:14, color:T.ink2, lineHeight:1.45 }}>
                    <AlertCircle size={14} color={T.clay} style={{flexShrink:0, marginTop:3}}/>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="Ask Neighbor" && (
        <div>
          <div style={{ background:T.card, border:`1px solid ${T.divider}`,
            borderRadius:14, padding:18, marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center" }}>
              <div>
                <Pill icon={MessageCircle}>Structured Q&A · not open chat</Pill>
                <div style={{ fontFamily:"Fraunces, serif", fontSize:20, color:T.ink,
                  marginTop:8 }}>What others asked before moving in</div>
                <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:12,
                  color:T.ink3, marginTop:4, maxWidth:520, lineHeight:1.5 }}>
                  Questions are predefined and answered by verified residents.
                  Responses are aggregated, summarized, and fed back into the
                  pricing engine's locality sentiment signal.
                </div>
              </div>
              <button style={{ padding:"9px 14px", background:T.paper,
                border:`1px solid ${T.divider}`, borderRadius:10, cursor:"pointer",
                fontFamily:"DM Sans, sans-serif", fontSize:12, color:T.ink2,
                display:"inline-flex", gap:6, alignItems:"center" }}>
                <Plus size={13}/> Ask a new structured question
              </button>
            </div>
          </div>
          {QUESTIONS_SEED.map((q,i)=><QACard key={i} q={q} idx={i}/>)}
        </div>
      )}

      {tab==="Verified Reviews" && (
        <div>
          <div style={{ background:T.card, border:`1px solid ${T.divider}`,
            borderRadius:14, padding:18, marginBottom:14,
            display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr auto", gap:14, alignItems:"center" }}>
            <Stat label="Verified score" value="4.3 / 5" sub="weighted, decayed"/>
            <Stat label="Verified residents" value="68" sub="trust weight 1.0×"/>
            <Stat label="GPS visitors" value="142" sub="trust weight 0.6×"/>
            <Stat label="Anonymous" value="29" sub="trust weight 0.25×"/>
            <button onClick={onAddReview} style={{
              padding:"10px 14px", border:"none", background:T.ink,
              color:T.paper, borderRadius:10, cursor:"pointer",
              fontFamily:"DM Sans, sans-serif", fontSize:12, fontWeight:500,
              display:"inline-flex", alignItems:"center", gap:7
            }}>
              <Crosshair size={13}/> Add GPS-verified review
            </button>
          </div>
          {REVIEWS_SEED.map(r=><ReviewCard key={r.id} r={r}/>)}
        </div>
      )}

      {tab==="Pricing" && (
        <div style={{ textAlign:"center", padding:40 }}>
          <button onClick={onPricing} style={{
            padding:"14px 22px", background:T.emerald, color:T.paper,
            border:"none", borderRadius:12, cursor:"pointer",
            fontFamily:"DM Sans, sans-serif", fontSize:14, fontWeight:500,
            display:"inline-flex", alignItems:"center", gap:8
          }}>
            <Sparkles size={16}/> Open AI Pricing Engine for this property
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// PRICING VIEW — AI Engine + Explainability + Comparables + Bid
// =============================================================================
function PriceGauge({ low, price, high, listed }) {
  // gauge from low to high; mark price; mark listed if outside expected too
  const min = Math.min(low, listed) * 0.96;
  const max = Math.max(high, listed) * 1.04;
  const pos = (v) => ((v-min)/(max-min))*100;
  return (
    <div style={{ marginTop:18 }}>
      <div style={{ position:"relative", height:54 }}>
        {/* range bar */}
        <div style={{ position:"absolute", top:22, left:0, right:0, height:10,
          background:"#E8DFCA", borderRadius:99 }}/>
        {/* confidence range */}
        <div style={{ position:"absolute", top:22, left:`${pos(low)}%`,
          width:`${pos(high)-pos(low)}%`, height:10,
          background:`linear-gradient(90deg, ${T.emerald2}, ${T.emerald})`,
          borderRadius:99 }}/>
        {/* price marker */}
        <div style={{ position:"absolute", left:`${pos(price)}%`, top:8,
          transform:"translateX(-50%)" }}>
          <div style={{ width:2, height:38, background:T.ink }}/>
          <div style={{ position:"absolute", top:-22,
            transform:"translateX(-50%)", left:"50%", whiteSpace:"nowrap" }}>
            <Pill tone="ink">AI · {fmtINRk(price)}</Pill>
          </div>
        </div>
        {/* listed marker */}
        <div style={{ position:"absolute", left:`${pos(listed)}%`, top:14,
          transform:"translateX(-50%)" }}>
          <div style={{ width:2, height:26, background:T.clay, opacity:0.85 }}/>
          <div style={{ position:"absolute", bottom:-18,
            transform:"translateX(-50%)", left:"50%", whiteSpace:"nowrap" }}>
            <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:10,
              color:T.clay }}>Listed {fmtINRk(listed)}</span>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:8,
        fontFamily:"JetBrains Mono, monospace", fontSize:10, color:T.ink3 }}>
        <span>{fmtINRk(low)}</span>
        <span>Fair-rent band</span>
        <span>{fmtINRk(high)}</span>
      </div>
    </div>
  );
}

function FactorRow({ d, base }) {
  const pct = (d.v / base) * 100;
  const positive = d.v >= 0;
  const Icon = d.icon;
  return (
    <div style={{ display:"grid", gridTemplateColumns:"22px 1fr 110px 80px",
      alignItems:"center", gap:10, padding:"9px 0",
      borderBottom:`1px dashed ${T.divider}` }}>
      <Icon size={14} color={T.ink3} strokeWidth={1.6}/>
      <div>
        <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:12.5, color:T.ink }}>
          {d.k}
        </div>
        <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10.5,
          color:T.ink3, marginTop:1 }}>
          Locality score: {d.score.toFixed(1)} / 10
        </div>
      </div>
      <div style={{ position:"relative", height:8, background:"#E8DFCA",
        borderRadius:99 }}>
        <div style={{ position:"absolute", left:"50%", top:0, bottom:0,
          width:`${Math.min(Math.abs(pct)*4,50)}%`,
          transform: positive?"translateX(0)":"translateX(-100%)",
          background: positive?T.emerald:T.clay, borderRadius:99,
          transition:"all 350ms" }}/>
        <div style={{ position:"absolute", left:"50%", top:-2, bottom:-2,
          width:1, background:T.ink2, opacity:0.4 }}/>
      </div>
      <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:12,
        color: positive?T.emerald:T.clay, textAlign:"right", fontWeight:500 }}>
        {positive?"+":""}{fmtINR(Math.round(d.v))}
      </div>
    </div>
  );
}

function ComparableRow({ c, onToggle, ref_psf }) {
  const psf = c.rent/c.size;
  const delta = ((psf-ref_psf)/ref_psf)*100;
  return (
    <div style={{ display:"grid", gridTemplateColumns:"40px 1fr 70px 70px 90px 50px",
      alignItems:"center", gap:10, padding:"10px 0",
      borderBottom:`1px dashed ${T.divider}`, opacity: c.active?1:0.45 }}>
      <Toggle on={c.active} onChange={()=>onToggle(c.id)}/>
      <div>
        <div style={{ fontFamily:"Fraunces, serif", fontSize:14, color:T.ink }}>
          {c.name}
        </div>
        <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:11, color:T.ink3,
          marginTop:1 }}>
          Floor {c.floor} · {c.age} yrs · {c.dist} km away
        </div>
      </div>
      <div style={{ textAlign:"right" }}>
        <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:11, color:T.ink3 }}>
          {c.size} sqft
        </div>
      </div>
      <div style={{ textAlign:"right" }}>
        <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:13,
          color:T.ink, fontWeight:500 }}>{fmtINRk(c.rent)}</div>
        <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:10,
          color:T.ink3 }}>₹{psf.toFixed(1)}/sqft</div>
      </div>
      <div style={{ textAlign:"right" }}>
        <Pill tone={c.similarity>=0.85?"emerald":c.similarity>=0.75?"mustard":"default"}>
          {Math.round(c.similarity*100)}% match
        </Pill>
      </div>
      <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:11,
        color: delta>0?T.clay:T.emerald, textAlign:"right" }}>
        {delta>0?"+":""}{delta.toFixed(0)}%
      </div>
    </div>
  );
}

function ExplainerChat({ onAsk, pricing }) {
  const presets = [
    "Why is this property priced higher?",
    "What factors reduced the price?",
    "Show me similar apartments",
  ];
  const [asked, setAsked] = useState(null);
  const responses = {
    "Why is this property priced higher?":
      `Three factors lifted this rent above the locality median: connectivity (${pricing.factorDeltas[1].score.toFixed(1)}/10) added +${fmtINRk(Math.round(pricing.factorDeltas[1].v))}, school access added +${fmtINRk(Math.round(pricing.factorDeltas[0].v))}, and the society's maintenance & safety added the rest. Walkability to 100ft Road carries a real premium here.`,
    "What factors reduced the price?":
      `Ambient noise penalty is the biggest dampener at ${fmtINR(Math.round(Math.abs(pricing.factorDeltas[3].v)))}. The building's age (8 yrs) also reduces per-sqft pricing slightly vs newer comparables like Purva Skywood.`,
    "Show me similar apartments":
      `The closest matches are Salarpuria Greenage (91% match, 1.8 km away) and Sobha Meadows (88% match in HSR). Both are similarly aged, similarly sized, and share the locality's amenity profile. Use the comparables list below to refine.`,
  };
  return (
    <div style={{ background:T.card, border:`1px solid ${T.divider}`, borderRadius:14,
      padding:18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <Pill icon={Sparkles}>Explain this price</Pill>
          <div style={{ fontFamily:"Fraunces, serif", fontSize:18, color:T.ink,
            marginTop:8 }}>Ask the engine, in plain English</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, marginTop:14, flexWrap:"wrap" }}>
        {presets.map(p=>(
          <button key={p} onClick={()=>setAsked(p)} style={{
            padding:"8px 12px", background: asked===p?T.ink:T.paper,
            color: asked===p?T.paper:T.ink2,
            border:`1px solid ${asked===p?T.ink:T.divider}`, borderRadius:99,
            cursor:"pointer", fontFamily:"DM Sans, sans-serif", fontSize:12
          }}>{p}</button>
        ))}
      </div>
      {asked && (
        <div style={{ marginTop:14, padding:"14px 16px", background:T.paper,
          borderRadius:10, borderLeft:`3px solid ${T.emerald}` }}>
          <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
            textTransform:"uppercase", letterSpacing:1.4, color:T.emerald }}>
            Engine response
          </div>
          <div style={{ fontFamily:"Fraunces, serif", fontSize:14.5, color:T.ink,
            marginTop:6, lineHeight:1.55 }}>
            {responses[asked]}
          </div>
        </div>
      )}
    </div>
  );
}

function BidPanel({ pricing, onBidPlaced }) {
  const [bid, setBid] = useState(pricing.price - 1500);
  const delta = ((bid - pricing.price)/pricing.price)*100;
  const verdict =
    bid < pricing.low ? { tone:"clay", t:"Below fair-rent band — owner likely declines" } :
    bid >= pricing.low && bid <= pricing.high ? { tone:"emerald", t:"Within fair-rent band — competitive bid" } :
    { tone:"mustard", t:"Above fair band — likely accepted, possibly overpaying" };
  return (
    <div style={{ background:T.card, border:`1px solid ${T.divider}`,
      borderRadius:14, padding:18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <Pill>Place a rental bid</Pill>
          <div style={{ fontFamily:"Fraunces, serif", fontSize:18, color:T.ink,
            marginTop:8 }}>What would you pay?</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:26,
            color:T.ink, fontWeight:500 }}>{fmtINR(bid)}</div>
          <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:11,
            color: delta<0?T.emerald:T.clay, marginTop:2 }}>
            {delta>0?"+":""}{delta.toFixed(1)}% vs AI fair rent
          </div>
        </div>
      </div>
      <input type="range" min={pricing.low-3000} max={pricing.high+3000} step={500}
             value={bid} onChange={e=>setBid(parseInt(e.target.value))}
             style={{ width:"100%", marginTop:14, accentColor:T.emerald }}/>
      <div style={{ marginTop:14, padding:"10px 14px",
        background: verdict.tone==="emerald"?"#E2EDDE":verdict.tone==="clay"?"#F3DCC4":"#F4E5BC",
        borderRadius:10, fontFamily:"Fraunces, serif", fontSize:13.5,
        color: verdict.tone==="emerald"?T.emerald:verdict.tone==="clay"?T.clay2:"#7A5D14",
        fontStyle:"italic" }}>
        {verdict.t}
      </div>
      <button onClick={()=>onBidPlaced(bid)} style={{
        marginTop:14, width:"100%", padding:"12px 14px", background:T.ink,
        color:T.paper, border:"none", borderRadius:10, cursor:"pointer",
        fontFamily:"DM Sans, sans-serif", fontSize:13, fontWeight:500,
        display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7
      }}>
        <Send size={14}/> Submit bid · feeds market signal back into AI
      </button>
      <div style={{ marginTop:10, fontFamily:"DM Sans, sans-serif", fontSize:10.5,
        color:T.ink3, lineHeight:1.5 }}>
        Your bid and 412 others on this society train the pricing engine.
        Owners see aggregated demand, not individual identities.
      </div>
    </div>
  );
}

function PricingView({ society, onBack, onBidPlaced }) {
  const loc = LOCALITIES.find(l=>l.id===society.locality);
  const [comps, setComps] = useState(COMPARABLES_SEED);
  const factors = {
    schools: loc.schools, connect: loc.connect, safety: loc.safety,
    noise: loc.noise, parking: society.parkingScore, maintenance: society.maintenance,
  };
  const pricing = useMemo(()=>computeAIPrice(FOCUS_PROPERTY, comps, factors), [comps]);
  const ref_psf = pricing.base / FOCUS_PROPERTY.size;
  const toggle = (id) => setComps(comps.map(c => c.id===id ? {...c, active:!c.active} : c));
  const activeCount = comps.filter(c=>c.active).length;

  return (
    <div>
      {/* breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:8,
        fontFamily:"DM Sans, sans-serif", fontSize:11, color:T.ink3,
        textTransform:"uppercase", letterSpacing:1.3 }}>
        <button onClick={onBack} style={{ background:"none", border:"none",
          cursor:"pointer", color:T.ink3, padding:0, display:"inline-flex",
          gap:5, alignItems:"center" }}>
          <ChevronLeft size={13}/> {society.name}
        </button>
        <span>/</span>
        <span style={{ color:T.ink }}>AI Pricing · Unit #401</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:24,
        marginTop:14 }}>
        {/* LEFT: pricing card + factors + comparables */}
        <div>
          {/* Big price card */}
          <div style={{ background:T.card, border:`1px solid ${T.divider}`,
            borderRadius:16, padding:24, position:"relative", overflow:"hidden" }}>
            {/* subtle corner ornament */}
            <svg style={{ position:"absolute", top:0, right:0, opacity:0.05 }}
                 width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="80" fill="none" stroke={T.ink} strokeWidth="0.5"/>
              <circle cx="90" cy="90" r="60" fill="none" stroke={T.ink} strokeWidth="0.5"/>
              <circle cx="90" cy="90" r="40" fill="none" stroke={T.ink} strokeWidth="0.5"/>
              <line x1="90" y1="0" x2="90" y2="180" stroke={T.ink} strokeWidth="0.5"/>
              <line x1="0" y1="90" x2="180" y2="90" stroke={T.ink} strokeWidth="0.5"/>
            </svg>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <Pill icon={Sparkles}>AI Contextual Pricing · v0.4</Pill>
                <div style={{ fontFamily:"Fraunces, serif", fontSize:13, color:T.ink3,
                  marginTop:10, letterSpacing:0.3 }}>
                  3BHK · {FOCUS_PROPERTY.size} sqft · Floor {FOCUS_PROPERTY.floor}/{FOCUS_PROPERTY.totalFloors} · {FOCUS_PROPERTY.furnishing}
                </div>
                <div style={{ display:"flex", alignItems:"baseline", gap:14, marginTop:14 }}>
                  <div style={{ fontFamily:"Fraunces, serif", fontSize:60,
                    fontWeight:400, color:T.ink, lineHeight:1, letterSpacing:-2 }}>
                    {fmtINR(pricing.price)}
                  </div>
                  <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:13,
                    color:T.ink3 }}>/month</div>
                </div>
                <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:12,
                  color:T.ink2, marginTop:6 }}>
                  Confidence band {fmtINR(pricing.low)} – {fmtINR(pricing.high)} · {pricing.confidence}% confident
                </div>
              </div>
              <div style={{ textAlign:"right", zIndex:1 }}>
                <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
                  textTransform:"uppercase", letterSpacing:1.4, color:T.ink3 }}>
                  Listed asking
                </div>
                <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:22,
                  color:T.clay, fontWeight:500, marginTop:2 }}>
                  {fmtINR(FOCUS_PROPERTY.listedRent)}
                </div>
                <Pill tone="clay">+{(((FOCUS_PROPERTY.listedRent-pricing.price)/pricing.price)*100).toFixed(1)}% above AI fair</Pill>
              </div>
            </div>

            <PriceGauge low={pricing.low} price={pricing.price}
                        high={pricing.high} listed={FOCUS_PROPERTY.listedRent}/>
          </div>

          {/* Factor breakdown */}
          <div style={{ background:T.card, border:`1px solid ${T.divider}`,
            borderRadius:14, padding:20, marginTop:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <Pill>Explainability layer</Pill>
                <div style={{ fontFamily:"Fraunces, serif", fontSize:20, color:T.ink,
                  marginTop:8 }}>How we got to {fmtINR(pricing.price)}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
                  textTransform:"uppercase", letterSpacing:1.4, color:T.ink3 }}>
                  Comparables base
                </div>
                <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:18,
                  color:T.ink2 }}>{fmtINR(pricing.base)}</div>
              </div>
            </div>
            <div style={{ marginTop:14 }}>
              {pricing.factorDeltas.map((d,i)=>
                <FactorRow key={i} d={d} base={pricing.base}/>
              )}
              <div style={{ display:"grid",
                gridTemplateColumns:"22px 1fr 110px 80px",
                alignItems:"center", gap:10, padding:"12px 0 4px" }}>
                <span/>
                <div style={{ fontFamily:"Fraunces, serif", fontSize:15, color:T.ink,
                  fontWeight:500 }}>Final AI suggestion</div>
                <span/>
                <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:14,
                  color:T.ink, textAlign:"right", fontWeight:600 }}>
                  {fmtINR(pricing.price)}
                </div>
              </div>
            </div>
          </div>

          {/* Comparables */}
          <div style={{ background:T.card, border:`1px solid ${T.divider}`,
            borderRadius:14, padding:20, marginTop:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <Pill icon={Filter}>Refine comparables</Pill>
                <div style={{ fontFamily:"Fraunces, serif", fontSize:20, color:T.ink,
                  marginTop:8 }}>Adjust what counts as similar</div>
                <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:12,
                  color:T.ink3, marginTop:3 }}>
                  Toggle properties off to see pricing recompute. Your choices train future suggestions.
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
                  textTransform:"uppercase", letterSpacing:1.4, color:T.ink3 }}>
                  Active
                </div>
                <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:20,
                  color:T.ink, fontWeight:500 }}>{activeCount} / {comps.length}</div>
              </div>
            </div>
            <div style={{ marginTop:14 }}>
              <div style={{ display:"grid",
                gridTemplateColumns:"40px 1fr 70px 70px 90px 50px",
                gap:10, paddingBottom:8, borderBottom:`1px solid ${T.divider}`,
                fontFamily:"DM Sans, sans-serif", fontSize:10,
                textTransform:"uppercase", letterSpacing:1.3, color:T.ink3 }}>
                <span>Use</span><span>Property</span>
                <span style={{textAlign:"right"}}>Size</span>
                <span style={{textAlign:"right"}}>Rent</span>
                <span style={{textAlign:"right"}}>Match</span>
                <span style={{textAlign:"right"}}>vs base</span>
              </div>
              {comps.map(c=><ComparableRow key={c.id} c={c} onToggle={toggle} ref_psf={ref_psf}/>)}
            </div>
          </div>

        </div>

        {/* RIGHT: explainer chat + bid */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <ExplainerChat pricing={pricing}/>
          <BidPanel pricing={pricing} onBidPlaced={onBidPlaced}/>

          {/* Locality context mini */}
          <div style={{ background:T.card, border:`1px solid ${T.divider}`,
            borderRadius:14, padding:16 }}>
            <Pill>Locality fingerprint</Pill>
            <div style={{ fontFamily:"Fraunces, serif", fontSize:15, color:T.ink,
              marginTop:8 }}>{loc.name}</div>
            <div style={{ marginTop:10 }}>
              {[
                { k:"Schools", v:loc.schools, i:GraduationCap },
                { k:"Connectivity", v:loc.connect, i:Train },
                { k:"Safety", v:loc.safety, i:Shield },
                { k:"Noise", v:loc.noise, i:Volume2, inv:true },
              ].map(r=>(
                <div key={r.k} style={{ display:"grid",
                  gridTemplateColumns:"18px 1fr 60px 32px", alignItems:"center",
                  gap:8, padding:"4px 0" }}>
                  <r.i size={12} color={T.ink3} strokeWidth={1.6}/>
                  <span style={{ fontFamily:"DM Sans, sans-serif", fontSize:11.5, color:T.ink2 }}>
                    {r.k}
                  </span>
                  <ScoreBar score={r.v} color={r.inv?T.clay:T.emerald}/>
                  <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:10,
                    color:T.ink, textAlign:"right" }}>{r.v.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// GPS REVIEW MODAL
// =============================================================================
function ReviewModal({ society, onClose, onSubmit }) {
  const [step, setStep] = useState("locate"); // locate, verified, form
  const [badge, setBadge] = useState(null);
  const [score, setScore] = useState(4);
  const [answers, setAnswers] = useState({});

  // simulate GPS verification
  useEffect(()=>{
    if (step==="locate") {
      const t = setTimeout(()=>setStep("verified"), 2400);
      return ()=>clearTimeout(t);
    }
  }, [step]);

  const struct = [
    { k:"noise", q:"Noise level at night", opts:["Very quiet","Mostly quiet","Some noise","Noisy"] },
    { k:"parking", q:"Parking availability", opts:["Plenty","Adequate","Tight","Always full"] },
    { k:"water", q:"Water reliability", opts:["Excellent","Good","Spotty","Frequent issues"] },
    { k:"safety", q:"Safety perception", opts:["Very safe","Safe","Mixed","Concerns"] },
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(26,29,26,0.45)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:50,
      padding:20 }}>
      <div style={{ background:T.paper, borderRadius:18, width:"100%", maxWidth:560,
        maxHeight:"90vh", overflowY:"auto", border:`1px solid ${T.divider}` }}>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", padding:"18px 22px", borderBottom:`1px solid ${T.divider}` }}>
          <div>
            <Pill icon={Crosshair}>GPS-verified feedback</Pill>
            <div style={{ fontFamily:"Fraunces, serif", fontSize:20, color:T.ink,
              marginTop:6 }}>{society.name}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none",
            cursor:"pointer", color:T.ink2 }}><X size={20}/></button>
        </div>

        <div style={{ padding:22 }}>
          {step==="locate" && (
            <div style={{ textAlign:"center", padding:"30px 10px" }}>
              <div style={{ position:"relative", width:140, height:140, margin:"0 auto" }}>
                <div style={{ position:"absolute", inset:0, borderRadius:"50%",
                  border:`2px solid ${T.emerald}`, animation:"riq-ping 1.6s ease-out infinite" }}/>
                <div style={{ position:"absolute", inset:20, borderRadius:"50%",
                  border:`2px solid ${T.emerald}`, opacity:0.6,
                  animation:"riq-ping 1.6s ease-out 0.4s infinite" }}/>
                <div style={{ position:"absolute", inset:50, borderRadius:"50%",
                  background:T.emerald, display:"flex", alignItems:"center",
                  justifyContent:"center" }}>
                  <Crosshair size={20} color={T.paper}/>
                </div>
              </div>
              <div style={{ fontFamily:"Fraunces, serif", fontSize:20, color:T.ink,
                marginTop:18 }}>Verifying your location…</div>
              <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:12,
                color:T.ink3, marginTop:6, maxWidth:380, margin:"6px auto 0",
                lineHeight:1.5 }}>
                We confirm you're within 50 m of the property. Your raw coordinates
                are discarded — only the verification badge is kept.
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6,
                justifyContent:"center", marginTop:14, fontFamily:"DM Sans, sans-serif",
                fontSize:11, color:T.ink3 }}>
                <Lock size={11}/> Privacy mode · explicit consent · auto-purge
              </div>
            </div>
          )}

          {step==="verified" && !badge && (
            <div>
              <div style={{ background:"#E2EDDE",
                border:`1px solid #B7CDB1`, borderRadius:12, padding:14,
                display:"flex", gap:12, alignItems:"center" }}>
                <Check size={20} color={T.emerald} strokeWidth={2.5}/>
                <div>
                  <div style={{ fontFamily:"Fraunces, serif", fontSize:15,
                    color:T.emerald, fontWeight:500 }}>
                    Verified — within 32 m of Prestige Acropolis
                  </div>
                  <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:11,
                    color:T.ink2, marginTop:2 }}>
                    Pick the badge that best describes your relationship to this property.
                  </div>
                </div>
              </div>
              <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:8 }}>
                {[
                  { id:"resident", label:"Verified resident", weight:"1.0×",
                    desc:"I currently live here. Highest trust weight.", icon:BadgeCheck, tone:"emerald" },
                  { id:"visitor", label:"GPS-verified visitor", weight:"0.6×",
                    desc:"I visited the property today. Medium trust weight.", icon:Crosshair, tone:"mustard" },
                  { id:"anon", label:"Anonymous", weight:"0.25×",
                    desc:"I'd rather not disclose. Lower trust weight.", icon:Lock, tone:"default" },
                ].map(b=>(
                  <button key={b.id} onClick={()=>{setBadge(b.id); setStep("form");}}
                    style={{
                      display:"flex", gap:12, alignItems:"center", padding:14,
                      background:T.card, border:`1px solid ${T.divider}`,
                      borderRadius:12, cursor:"pointer", textAlign:"left"
                    }}>
                    <b.icon size={18} color={b.tone==="emerald"?T.emerald:b.tone==="mustard"?T.mustard:T.ink2}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"Fraunces, serif", fontSize:15, color:T.ink }}>
                        {b.label} <span style={{ fontFamily:"JetBrains Mono, monospace",
                          fontSize:11, color:T.ink3, marginLeft:6 }}>{b.weight}</span>
                      </div>
                      <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:11.5,
                        color:T.ink3, marginTop:1 }}>{b.desc}</div>
                    </div>
                    <ChevronRight size={16} color={T.ink3}/>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step==="form" && badge && (
            <div>
              <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
                textTransform:"uppercase", letterSpacing:1.4, color:T.ink3 }}>
                Overall
              </div>
              <div style={{ display:"flex", gap:6, marginTop:8 }}>
                {[1,2,3,4,5].map(i=>(
                  <button key={i} onClick={()=>setScore(i)} style={{
                    background:"transparent", border:"none", cursor:"pointer", padding:0
                  }}>
                    <Star size={28} fill={i<=score?T.mustard:"transparent"}
                      color={i<=score?T.mustard:T.divider} strokeWidth={1.5}/>
                  </button>
                ))}
              </div>

              <div style={{ marginTop:18 }}>
                {struct.map(s=>(
                  <div key={s.k} style={{ marginBottom:14 }}>
                    <div style={{ fontFamily:"Fraunces, serif", fontSize:14,
                      color:T.ink }}>{s.q}</div>
                    <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                      {s.opts.map(o=>(
                        <button key={o} onClick={()=>setAnswers({...answers,[s.k]:o})}
                          style={{
                            padding:"7px 11px",
                            background: answers[s.k]===o?T.ink:T.card,
                            color: answers[s.k]===o?T.paper:T.ink2,
                            border:`1px solid ${answers[s.k]===o?T.ink:T.divider}`,
                            borderRadius:99, cursor:"pointer",
                            fontFamily:"DM Sans, sans-serif", fontSize:12
                          }}>{o}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={()=>{onSubmit({badge, score, answers}); onClose();}}
                style={{
                  marginTop:6, width:"100%", padding:"12px 14px", background:T.emerald,
                  color:T.paper, border:"none", borderRadius:10, cursor:"pointer",
                  fontFamily:"DM Sans, sans-serif", fontSize:13, fontWeight:500,
                  display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7
                }}>
                <Send size={14}/> Submit verified feedback
              </button>
              <div style={{ marginTop:8, fontFamily:"DM Sans, sans-serif", fontSize:10.5,
                color:T.ink3, textAlign:"center", lineHeight:1.5 }}>
                Older reviews lose weight over time. This one starts at full trust.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// CONFIRMATION TOAST
// =============================================================================
function Toast({ message, onClose }) {
  useEffect(()=>{ const t = setTimeout(onClose, 3800); return ()=>clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
      background:T.ink, color:T.paper, padding:"14px 22px", borderRadius:99,
      fontFamily:"DM Sans, sans-serif", fontSize:13, zIndex:60,
      boxShadow:"0 8px 24px rgba(0,0,0,0.18)", display:"flex", alignItems:"center", gap:10 }}>
      <Check size={15} color={T.paper}/>{message}
    </div>
  );
}

// =============================================================================
// APP SHELL
// =============================================================================
export default function App() {
  const [view, setView] = useState("explore");
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [selectedSociety, setSelectedSociety] = useState(SOCIETIES[0]);
  const [showReview, setShowReview] = useState(false);
  const [toast, setToast] = useState(null);

  return (
    <div style={{
      background: T.paper, minHeight:"100vh", color: T.ink,
      fontFamily:"DM Sans, sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes riq-ping {
          0% { transform: scale(0.6); opacity: 1; }
          80%, 100% { transform: scale(1.6); opacity: 0; }
        }
        input[type=range]::-webkit-slider-runnable-track {
          height: 4px; background: #D8D2C5; border-radius: 99px;
        }
        input[type=range]::-webkit-slider-thumb {
          appearance: none; width: 18px; height: 18px; background: ${T.ink};
          border-radius: 50%; margin-top: -7px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        ::selection { background: ${T.mustard}; color: ${T.ink}; }
      `}</style>

      {/* TOP NAV */}
      <header style={{ borderBottom:`1px solid ${T.divider}`,
        background:T.paper, position:"sticky", top:0, zIndex:30 }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"14px 22px",
          display:"flex", alignItems:"center", gap:18 }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}
               onClick={()=>setView("explore")}>
            <div style={{ width:32, height:32, background:T.ink, borderRadius:8,
              display:"flex", alignItems:"center", justifyContent:"center",
              position:"relative" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 21 L3 10 L12 3 L21 10 L21 21" stroke={T.paper}
                  strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="12" cy="14" r="2.5" fill={T.mustard}/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily:"Fraunces, serif", fontSize:18,
                fontWeight:500, lineHeight:1, letterSpacing:-0.3 }}>
                RentalIQ
                <span style={{ fontFamily:"JetBrains Mono, monospace",
                  fontSize:9, color:T.clay, marginLeft:5, letterSpacing:1,
                  verticalAlign:"top" }}>AI</span>
              </div>
              <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:9.5,
                color:T.ink3, letterSpacing:1.4, textTransform:"uppercase",
                marginTop:2 }}>Hyperlocal rental intelligence</div>
            </div>
          </div>

          {/* Search */}
          <div style={{ flex:1, maxWidth:520, margin:"0 auto",
            background:T.card, border:`1px solid ${T.divider}`, borderRadius:99,
            padding:"8px 14px", display:"flex", alignItems:"center", gap:10 }}>
            <Search size={15} color={T.ink3}/>
            <input placeholder="Search a society, locality, or address in Bengaluru…"
              style={{ background:"transparent", border:"none", outline:"none", flex:1,
                fontFamily:"DM Sans, sans-serif", fontSize:13, color:T.ink }}/>
            <Pill tone="ink"><Hash size={10}/>3BHK</Pill>
          </div>

          {/* Right cluster */}
          <div style={{ display:"flex", gap:14, alignItems:"center" }}>
            <Pill icon={Sparkles}>AI v0.4</Pill>
            <div style={{ width:34, height:34, borderRadius:99,
              background:`linear-gradient(135deg, ${T.emerald}, ${T.mustard})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              color:T.paper, fontFamily:"Fraunces, serif", fontSize:14,
              fontWeight:500 }}>A</div>
          </div>
        </div>

        {/* Sub-stats strip */}
        <div style={{ borderTop:`1px solid ${T.divider}`, background:T.paperDark }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"7px 22px",
            display:"flex", gap:24, alignItems:"center",
            fontFamily:"JetBrains Mono, monospace", fontSize:10.5, color:T.ink3,
            letterSpacing:0.5 }}>
            <span><b style={{color:T.ink}}>8,412</b> verified data points</span>
            <span><b style={{color:T.ink}}>2,140</b> GPS-verified visitors</span>
            <span><b style={{color:T.ink}}>198</b> resident-verified profiles</span>
            <span><b style={{color:T.ink}}>91.2%</b> bid-clearance accuracy (90-day)</span>
            <span style={{ marginLeft:"auto", display:"inline-flex",
              alignItems:"center", gap:6 }}>
              <span style={{ width:6, height:6, background:T.emerald,
                borderRadius:99 }}/>Live · pricing engine v0.4 trained 11 May
            </span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ maxWidth:1280, margin:"0 auto", padding:"24px 22px 80px" }}>
        {view==="explore" && (
          <div>
            {/* Title block */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 320px",
              gap:30, alignItems:"end", marginBottom:24 }}>
              <div>
                <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:11,
                  textTransform:"uppercase", letterSpacing:1.6, color:T.clay }}>
                  Bengaluru · May 2026
                </div>
                <h1 style={{ fontFamily:"Fraunces, serif", fontSize:54,
                  fontWeight:400, color:T.ink, margin:"6px 0 0", letterSpacing:-1,
                  lineHeight:1.02 }}>
                  Read the city <em style={{ color:T.clay }}>before</em><br/>
                  you sign the lease.
                </h1>
                <p style={{ fontFamily:"Fraunces, serif", fontSize:16, color:T.ink2,
                  marginTop:14, maxWidth:540, lineHeight:1.55, fontStyle:"italic" }}>
                  Locality intelligence, verified neighbor voices, and an AI engine
                  that prices each home on the things brokers don't quantify —
                  school access, road noise, parking, and how the society actually feels.
                </p>
              </div>
              <div style={{ background:T.card, border:`1px solid ${T.divider}`,
                borderRadius:14, padding:16 }}>
                <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:10,
                  textTransform:"uppercase", letterSpacing:1.4, color:T.ink3 }}>
                  Three things this isn't
                </div>
                {["A listing aggregator with filters",
                  "A pricing calculator with two inputs",
                  "Yet another star-rating review pile"].map(t=>(
                  <div key={t} style={{ display:"flex", gap:8, marginTop:8,
                    fontFamily:"Fraunces, serif", fontSize:13, color:T.ink2,
                    fontStyle:"italic" }}>
                    <X size={14} color={T.clay} strokeWidth={2}
                      style={{ flexShrink:0, marginTop:3 }}/>{t}
                  </div>
                ))}
              </div>
            </div>

            <ExploreView onSelectLocality={(id)=>{
              const soc = SOCIETIES.find(s=>s.locality===id) || SOCIETIES[0];
              setSelectedSociety(soc);
              setSelectedLocality(id);
              setView("society");
            }}/>
          </div>
        )}

        {view==="society" && (
          <SocietyView
            society={selectedSociety}
            onBack={()=>setView("explore")}
            onPricing={()=>setView("pricing")}
            onAddReview={()=>setShowReview(true)}
          />
        )}

        {view==="pricing" && (
          <PricingView
            society={selectedSociety}
            onBack={()=>setView("society")}
            onBidPlaced={(amt)=>{
              setToast(`Bid of ${fmtINR(amt)} submitted. Owner notified. Demand signal recorded.`);
            }}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop:`1px solid ${T.divider}`,
        background:T.paperDark, marginTop:60 }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"22px",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          fontFamily:"DM Sans, sans-serif", fontSize:11, color:T.ink3 }}>
          <div>RentalIQ AI · Prototype MVP · For demonstration only</div>
          <div style={{ display:"flex", gap:18 }}>
            <span>Privacy-first GPS</span><span>Explainable AI</span>
            <span>Resident-weighted reviews</span>
          </div>
        </div>
      </footer>

      {showReview && (
        <ReviewModal
          society={selectedSociety}
          onClose={()=>setShowReview(false)}
          onSubmit={()=>setToast("Verified feedback submitted. Trust weight applied.")}
        />
      )}
      {toast && <Toast message={toast} onClose={()=>setToast(null)}/>}
    </div>
  );
}
