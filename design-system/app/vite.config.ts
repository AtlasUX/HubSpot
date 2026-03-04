import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  plugins: [react()],
  server: {
    fs: {
      allow: [".."],
    },
  },
});
