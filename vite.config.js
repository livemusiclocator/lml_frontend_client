import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

// vite build --watch, as used by `make watch`
const watching = process.argv.includes("--watch") || process.argv.includes("-w");

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    tailwindcss(),
    // the visualizer writes into the project root on every build, which a
    // watching build picks up as a change and rebuilds forever - so leave it
    // out of watching builds
    ...(watching
      ? []
      : [
          visualizer({
            filename: "tmp/bundle-analysis.html",
            open: false,
          }),
        ]),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    // belt and braces: never let build output retrigger a watching build
    watch: watching ? { exclude: ["tmp/**", "dists/**", "node_modules/**"] } : null,
    assetsInlineLimit: (filePath, content) => {
      // these paths should never be inlined into bundle as are rarely used and edition-specific
      if (filePath.includes("/gigSeriesCustom/")) {
        return false;
      }
      // Default behavior for other files (inline if < 4KB)
      return content.length < 4096;
    },
    rollupOptions: {
      output: {
        // the hash is what lets these be cached forever: a new build is a new
        // url, so nothing has to expire for a deploy to be seen. Rails resolves
        // the current names out of manifest.json rather than being told them,
        // which is what keeps a frontend deploy from needing a rails one.
        entryFileNames: "lml_gig_explorer.[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == "index.css")
            return "lml_gig_explorer.[hash].css";
          // use original file names for everything else
          return assetInfo.name;
        },
      },
    },
  },
});
