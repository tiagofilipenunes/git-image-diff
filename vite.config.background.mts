import { defineConfig } from "vite";
import { sharedConfig } from "./vite.config.mts";
import { isDev, r } from "./scripts/prepare";
import packageJson from "./package.json";

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  build: {
    watch: isDev ? {} : undefined,
    outDir: r("./dist/src/workers"),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? "inline" : false,
    lib: {
      entry: r("src/workers/background.ts"),
      name: packageJson.name,
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "background.js",
        extend: true,
      },
    },
  },
});
