import React from "react";
import { T, FONTS } from "../../theme";
import { LOCALITIES } from "../../data";
import { fmtINRk } from "../../utils";

// Stylized SVG cartography of Bengaluru localities.
export default function CityMap({ selected, onSelect, hoverId, setHoverId }) {
  return (
    <svg viewBox="0 0 1000 640" className="w-full h-full" style={{ display: "block" }}>
      <defs>
        <pattern id="paperGrain" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.5" fill="#000" opacity="0.025" />
        </pattern>
        <pattern id="hatch" x="0" y="0" width="6" height="6"
                 patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={T.ink} strokeWidth="0.6" opacity="0.08" />
        </pattern>
        <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
          <stop offset="60%" stopColor={T.paper} stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.08" />
        </radialGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dy="2" />
          <feComponentTransfer><feFuncA type="linear" slope="0.15" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect width="1000" height="640" fill={T.paper} />
      <rect width="1000" height="640" fill="url(#paperGrain)" />

      <g opacity="0.18" stroke={T.ink3} fill="none" strokeWidth="0.5">
        <path d="M -50 200 Q 250 140, 500 220 T 1050 180" />
        <path d="M -50 260 Q 250 200, 500 280 T 1050 240" />
        <path d="M -50 380 Q 250 320, 500 400 T 1050 360" />
        <path d="M -50 460 Q 250 400, 500 480 T 1050 440" />
      </g>

      <g opacity="0.55">
        <path d="M 650 400 Q 720 380, 780 410 Q 800 440, 760 470 Q 700 480, 640 460 Q 620 430, 650 400 Z"
              fill={T.sky} opacity="0.35" />
        <path d="M 460 420 Q 510 410, 540 430 Q 540 450, 500 460 Q 460 455, 450 440 Z"
              fill={T.sky} opacity="0.3" />
      </g>

      <g stroke={T.ink2} strokeWidth="1.2" fill="none" opacity="0.35" strokeLinecap="round">
        <ellipse cx="540" cy="320" rx="380" ry="240" strokeDasharray="2 3" opacity="0.45" />
        <path d="M 100 200 Q 400 180, 700 200 T 980 220" />
        <path d="M 560 180 Q 500 240, 460 300 Q 480 380, 520 440" />
        <path d="M 460 320 Q 600 380, 750 470" />
        <path d="M 600 280 Q 720 240, 850 240" />
      </g>

      <g stroke={T.clay} strokeWidth="1.8" fill="none" opacity="0.55" strokeDasharray="6 4">
        <path d="M 120 160 Q 380 160, 580 180 Q 750 210, 880 240" />
      </g>

      {LOCALITIES.map((loc) => {
        const isSel = selected === loc.id;
        const isHover = hoverId === loc.id;
        const fill = T.heat[loc.heat];
        return (
          <g key={loc.id}
             onClick={() => onSelect(loc.id)}
             onMouseEnter={() => setHoverId(loc.id)}
             onMouseLeave={() => setHoverId(null)}
             style={{ cursor: "pointer" }}>
            <rect x={loc.cx - loc.w / 2} y={loc.cy - loc.h / 2}
                  width={loc.w} height={loc.h} rx="14"
                  fill={fill}
                  stroke={isSel ? T.ink : T.ink2}
                  strokeWidth={isSel ? 2.2 : 1}
                  opacity={isHover || isSel ? 1 : 0.92}
                  style={{ transition: "all 200ms" }} />
            {(isHover || isSel) && (
              <rect x={loc.cx - loc.w / 2} y={loc.cy - loc.h / 2}
                    width={loc.w} height={loc.h} rx="14"
                    fill="url(#hatch)" pointerEvents="none" />
            )}
            <circle cx={loc.cx} cy={loc.cy} r="3" fill={T.ink} />
            <g transform={`translate(${loc.cx + loc.label.dx}, ${loc.cy + loc.label.dy})`}>
              <text textAnchor="middle" fontFamily={FONTS.serif} fontSize="17"
                    fontWeight="500" fill={T.ink} letterSpacing="0.3">
                {loc.name}
              </text>
              <text y="16" textAnchor="middle" fontFamily={FONTS.mono}
                    fontSize="11" fill={T.ink2} letterSpacing="0.5">
                {fmtINRk(loc.avgRent)} · {loc.trend > 0 ? "↑" : "↓"}{Math.abs(loc.trend).toFixed(1)}%
              </text>
            </g>
          </g>
        );
      })}

      <g transform="translate(930, 540)" opacity="0.7">
        <circle r="22" fill="none" stroke={T.ink2} strokeWidth="0.8" />
        <path d="M 0 -18 L 4 0 L 0 18 L -4 0 Z" fill={T.ink} />
        <text y="-26" textAnchor="middle" fontFamily={FONTS.serif}
              fontSize="11" fill={T.ink}>N</text>
      </g>

      <g transform="translate(40, 600)" fill={T.ink2}>
        <line x1="0" y1="0" x2="80" y2="0" stroke={T.ink2} strokeWidth="1" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke={T.ink2} strokeWidth="1" />
        <line x1="40" y1="-2" x2="40" y2="2" stroke={T.ink2} strokeWidth="1" />
        <line x1="80" y1="-3" x2="80" y2="3" stroke={T.ink2} strokeWidth="1" />
        <text y="16" fontFamily={FONTS.mono} fontSize="9">0</text>
        <text x="80" y="16" fontFamily={FONTS.mono} fontSize="9" textAnchor="end">~2 km</text>
      </g>

      <rect width="1000" height="640" fill="url(#vignette)" pointerEvents="none" />
    </svg>
  );
}
