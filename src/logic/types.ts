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
  action: "loadImage";
};
