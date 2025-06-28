import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "lml.js", // Single predictable name
        chunkFileNames: "lml-[name].js",
      },
    },
  },
});
