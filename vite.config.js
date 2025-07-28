import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

  return null;
}
// https://vitejs.dev/config/
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
      output: {
        entryFileNames: "lml_gig_explorer.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == "styles.css") return "lml_gig_explorer.css";
          // use original file names for everything else
          return assetInfo.name;
        },
        manualChunks: manualChunks,
      },
    },
  },
});
