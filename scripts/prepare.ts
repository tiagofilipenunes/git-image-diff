import fs from "fs-extra";
import { getManifest } from "../src/manifest";
import { resolve } from "node:path";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const port = Number(process.env.PORT || "") || 3303;
export const r = (...args: string[]) => resolve(__dirname, "..", ...args);

export const isDev = process.env.NODE_ENV !== "production";
export const isFirefox = process.env.EXTENSION === "firefox";

export async function writeManifest() {
  const resolvedDirPath = r("dist");
  const resolvedFilePath = r("dist/manifest.json");
  await fs.mkdir(resolvedDirPath, { recursive: true });
  await fs.writeJSON(resolvedFilePath, getManifest(), {
    spaces: 2,
  });
}
writeManifest();
