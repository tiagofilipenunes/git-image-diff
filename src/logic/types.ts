export type AlgoName = "difference" | "overlay";

export type RequestMessage = {
  src: string;
  action: "loadImage" | "setDefaultView";
};

export type RequestResponse = {
  success: boolean;
  response: string;
};

export type Settings = Record<string, unknown> & {
  diffColor: string;
  defaultAlgo: string;
};
