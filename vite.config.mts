import { defineConfig, loadEnv } from "vite";
import type { UserConfig } from "vite";
import { isDev, r } from "./scripts/prepare";
import AutoImport from "unplugin-auto-import/vite";

export const sharedConfig: UserConfig = {
  plugins: [
    AutoImport({
      imports: [
        {
          "webextension-polyfill": [["*", "browser"]],
        },
      ],
      dts: r("src/auto-imports.d.ts"),
    }),
  ],
  optimizeDeps: {
    include: ["webextension-polyfill"],
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  build: {
    sourcemap: isDev ? "inline" : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
    },
  },
};

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    ...sharedConfig,
    define: {
      EXTENSION: JSON.stringify(env.EXTENSION),
    },
    build: {
      outDir: r("./dist/"),
      rollupOptions: {
        input: {
          popup: r("src/popup/index.html"),
          index: r("src/popup/index.ts"),
        },
        output: {
          entryFileNames: "src/popup/index.js",
        },
      },
    },
  };
});
