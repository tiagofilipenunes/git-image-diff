export type AlgoName = "difference" | "overlay";
import pixelmatch from "pixelmatch";

export type RequestMessage = {
  src: string;
  action: "loadImage" | "setDefaultView";
};

export type RequestResponse = {
  success: boolean;
  response: string;
};

export type PixelmatchSettings = NonNullable<Parameters<typeof pixelmatch>[5]>;

export type Settings = Record<string, unknown> & {
  pixelmatchSettings: PixelmatchSettings;
  defaultAlgo: string;
};
