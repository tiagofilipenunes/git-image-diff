import type { Manifest } from "webextension-polyfill";
import { isFirefox } from "../scripts/prepare";
import packageJSON from "../package.json";

const firefoxSettings: Partial<Manifest.WebExtensionManifest> = {
  browser_specific_settings: {
    gecko: {
      id: "git-image-diff@tiago",
    },
  },
  // In Firefox, the color picker brings the window out of focus and closes the pop-up, so preferences is preferable
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1676222
  options_ui: {
    page: "./src/popup/index.html",
  },
  background: {
    scripts: ["src/workers/background.js"],
    type: "module",
  },
};

const chromiumSettings: Partial<Manifest.WebExtensionManifest> = {
  background: {
    service_worker: "src/workers/background.js",
    type: "module",
  },
  action: {
    default_popup: "./src/popup/index.html",
  },
};

const sharedConfig: Manifest.WebExtensionManifest = {
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
  content_scripts: [
    {
      js: ["src/content-scripts/image-diff.js"],
      css: ["src/content-scripts/style.css"],
      matches: ["https://viewscreen.githubusercontent.com/*"],
      run_at: "document_idle",
      all_frames: true,
    },
  ],
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

export function getManifest(): Manifest.WebExtensionManifest {
  return {
    ...sharedConfig,
    ...(isFirefox ? firefoxSettings : chromiumSettings),
  };
}
