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
    `}</style>
  );
}
