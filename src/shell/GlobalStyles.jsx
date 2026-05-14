import React from "react";
import { T } from "../theme";

// Single source of truth for global CSS: font import, keyframes,
// range slider track/thumb, and selection color.
export default function GlobalStyles() {
  return (
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

      /* Leaflet container — Airbnb-style minimal frame. */
      .leaflet-container { font-family: 'DM Sans', sans-serif; }
      .leaflet-control-attribution {
        background: rgba(255,255,255,0.85) !important;
        font-size: 10px !important;
        color: ${T.ink3} !important;
      }
      .leaflet-control-attribution a { color: ${T.ink2} !important; }
      .leaflet-control-zoom {
        border: none !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.12) !important;
        border-radius: 10px !important;
        overflow: hidden;
      }
      .leaflet-control-zoom a {
        background: #fff !important;
        color: ${T.ink} !important;
        border-color: ${T.divider} !important;
        font-weight: 500;
      }
      .leaflet-control-zoom a:hover { background: ${T.card} !important; }

      /* Airbnb-style price pill markers (built via L.divIcon) */
      .riq-marker-wrap { background: transparent !important; border: none !important; }
      .riq-marker {
        position: absolute;
        transform: translate(-50%, -50%);
        display: flex; flex-direction: column; align-items: center;
        gap: 6px;
        cursor: pointer;
        user-select: none;
        will-change: transform;
      }
      .riq-pill {
        background: #fff;
        color: ${T.ink};
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        font-weight: 600;
        padding: 7px 12px;
        border-radius: 99px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06);
        white-space: nowrap;
        display: inline-flex; align-items: center; gap: 7px;
        transition: transform 0.18s ease-out, box-shadow 0.18s ease-out,
                    background-color 0.18s, color 0.18s;
      }
      .riq-dot {
        width: 7px; height: 7px; border-radius: 99px;
        display: inline-block;
        box-shadow: 0 0 0 2px rgba(255,255,255,0.6);
      }
      .riq-price { letter-spacing: -0.1px; }
      .riq-trend {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10.5px;
        font-weight: 500;
        color: ${T.ink3};
        letter-spacing: 0.2px;
      }
      .riq-marker:hover .riq-pill, .riq-marker.hov .riq-pill {
        transform: scale(1.12);
        box-shadow: 0 6px 16px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.1);
      }
      .riq-marker.sel .riq-pill {
        background: ${T.ink};
        color: #fff;
        transform: scale(1.18);
        box-shadow: 0 8px 22px rgba(0,0,0,0.32);
      }
      .riq-marker.sel .riq-trend { color: rgba(255,255,255,0.78); }
      .riq-marker.sel .riq-dot { box-shadow: 0 0 0 2px rgba(255,255,255,0.18); }
      .riq-label {
        font-family: 'Fraunces', serif;
        font-size: 12.5px;
        font-weight: 500;
        color: ${T.ink};
        background: rgba(255,255,255,0.97);
        padding: 3px 10px;
        border-radius: 7px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.14);
        pointer-events: none;
        opacity: 0;
        transform: translateY(-3px);
        transition: opacity 0.18s, transform 0.18s;
        white-space: nowrap;
        letter-spacing: 0.1px;
      }
      .riq-marker:hover .riq-label,
      .riq-marker.hov .riq-label,
      .riq-marker.sel .riq-label { opacity: 1; transform: translateY(0); }

      /* Drill-in apartment markers — smaller, white, less ornate. */
      .riq-apt {
        position: absolute;
        transform: translate(-50%, -50%);
        display: flex; flex-direction: column; align-items: center;
        gap: 4px;
        cursor: pointer;
        user-select: none;
      }
      .riq-apt-pill {
        background: #fff;
        color: ${T.ink};
        font-family: 'DM Sans', sans-serif;
        font-size: 11.5px;
        font-weight: 600;
        padding: 4px 9px;
        border-radius: 99px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06);
        white-space: nowrap;
        transition: transform 0.15s ease-out, box-shadow 0.15s ease-out,
                    background-color 0.15s, color 0.15s;
      }
      .riq-apt:hover .riq-apt-pill, .riq-apt.hov .riq-apt-pill {
        background: ${T.ink};
        color: #fff;
        transform: scale(1.18);
        box-shadow: 0 4px 12px rgba(0,0,0,0.28);
      }
      .riq-apt-label {
        font-family: 'DM Sans', sans-serif;
        font-size: 10.5px;
        font-weight: 500;
        color: ${T.ink};
        background: rgba(255,255,255,0.96);
        padding: 2px 7px;
        border-radius: 6px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.12);
        pointer-events: none;
        opacity: 0;
        transform: translateY(-2px);
        transition: opacity 0.15s, transform 0.15s;
        white-space: nowrap;
      }
      .riq-apt:hover .riq-apt-label,
      .riq-apt.hov .riq-apt-label { opacity: 1; transform: translateY(0); }
    `}</style>
  );
}
