import { RGBTuple } from "pixelmatch";
import { Settings } from "./types";

export const hex2rgb = (hex: string): RGBTuple => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

export const defaultSettings: Settings = {
  diffColor: "#FF0000",
  defaultAlgo: "",
};

export const getSettings = async (): Promise<Settings> => {
  try {
    return browser.storage.sync.get(defaultSettings) as Promise<Settings>;
  } catch (r) {
    throw new Error(`Settings could not be retrieved. Error: ${r}`);
  }
};

export const createCanvasElement = (img: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Couldn't get 2d context");
  ctx.drawImage(img, 0, 0);
  return ctx;
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
