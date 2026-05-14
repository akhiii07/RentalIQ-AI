import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Project site served at https://akhiii07.github.io/RentalIQ-AI/
// In dev (`npm run dev`) Vite ignores `base` and serves at /.
export default defineConfig({
  plugins: [react()],
  base: "/RentalIQ-AI/",
});
