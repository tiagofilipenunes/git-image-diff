import type { Manifest } from "webextension-polyfill";
import { isFirefox } from "../scripts/prepare";
import packageJSON from "../package.json";

export async function getManifest(): Promise<Manifest.WebExtensionManifest> {
  return {
    manifest_version: 3,
    name: packageJSON.displayName,
    description: packageJSON.description,
    version: packageJSON.version,
    icons: {
      "16": "./assets/icon16.png",
      "32": "./assets/icon32.png",
      "64": "./assets/icon64.png",
      "128": "./assets/icon128.png",
    },
    browser_specific_settings: {
      gecko: {
        id: "git-image-diff@tiago",
      },
    },
    action: {
      default_popup: "./src/popup/index.html",
    },
    content_scripts: [
      {
        js: ["src/content-scripts/image-diff.js"],
        css: ["src/content-scripts/style.css"],
        matches: ["https://viewscreen.githubusercontent.com/*"],
        run_at: "document_idle",
        all_frames: true,
      },
    ],
    background: isFirefox
      ? {
          scripts: ["src/workers/background.js"],
          type: "module",
        }
      : {
          service_worker: "./src/workers/background.js",
          type: "module",
        },
    web_accessible_resources: [
      {
        resources: [],
        matches: ["*://github.com/*", "*://viewscreen.githubusercontent.com/*"],
      },
    ],
    host_permissions: [
      "*://github.com/*", // To modify embedded iframes in the review page
      "*://viewscreen.githubusercontent.com/*",
    ],
    permissions: ["storage"],
  };
}
