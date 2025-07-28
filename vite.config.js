import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    tailwindcss(),
    visualizer({
      filename: "tmp/bundle-analysis.html",
      open: false,
    }),
  ],
  build: {
    rollupOptions: {
      external: ["leaflet"],
      output: {
        globals: {
          leaflet: "L",
        },
        entryFileNames: (entry) => {
          // todo: this can be configured way simpler I think
          if (entry.name == "lml_gig_explorer") {
            return "lml_gig_explorer.js";
          }
          return entry.name;
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == "styles.css") return "lml_gig_explorer.css";
          // use original file names for everything else
          return assetInfo.name;
        },
      },
      input: {
        // todo: define entrypoint properly - dont use the indx.html as this is dev only
        lml_gig_explorer: "index.html",
        "leaflet.js": "node_modules/leaflet/dist/leaflet.js",
        leaflet: "node_modules/leaflet/dist/leaflet.css",
      },
    },
  },
});
