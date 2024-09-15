import { defineConfig } from "vite";
import { sharedConfig } from "./vite.config.mts";
import { isDev, r } from "./scripts/prepare";
import packageJson from "./package.json";

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  build: {
    watch: isDev ? {} : undefined,
    outDir: r("./dist/src/content-scripts"),
    emptyOutDir: false,
    lib: {
      entry: r("src/content-scripts/image-diff.ts"),
      name: packageJson.name,
    },
    rollupOptions: {
      output: {
        entryFileNames: "image-diff.js",
        extend: true,
      },
    },
  },
});
