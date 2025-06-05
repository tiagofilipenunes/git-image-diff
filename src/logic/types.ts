export type AlgoName = "difference" | "overlay";

export type RequestMessage = {
  src: string;
  action: "loadImage" | "setDefaultView";
};

export type RequestResponse = {
  success: boolean;
  response: string;
};

export type PixelmatchSettings = {
  threshold?: number;
  alpha?: number;
  aaColor?: [number, number, number];
  diffColor?: [number, number, number];
  includeAA: boolean | undefined;
  diffColorAlt: [number, number, number] | undefined;
};

export type Settings = Record<string, unknown> & {
  pixelmatchSettings: PixelmatchSettings;
  defaultAlgo: string;
};
