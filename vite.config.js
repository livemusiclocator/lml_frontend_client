import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
function manualChunks(id) {
  if (id.includes(".css")) {
    return "styles";
  }

  return null;
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: manualChunks,
      },
    },
  },
});
