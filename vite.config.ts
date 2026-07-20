import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Split heavy vendor libs into their own chunks so the main bundle stays small
    // and chunks can be cached independently across deploys.
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          gsap: ["gsap", "@gsap/react"],
          shiki: ["shiki"],
          icons: ["lucide-react"],
        },
      },
    },
    // Slightly higher warning limit since shiki/icons are intentionally separate chunks.
    chunkSizeWarningLimit: 800,
  },
});
