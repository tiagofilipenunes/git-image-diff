export type Algo = {
  name: string;
  func: (
    viewElement: HTMLDivElement,
    imgA: HTMLImageElement,
    imgB: HTMLImageElement
  ) => void;
};

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
