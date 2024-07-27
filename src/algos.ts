import pixelmatch, { RGBTuple } from "pixelmatch";
import { createCanvasElement } from "./utils";
import { Algo } from "./types";

const MAX_WIDTH = 414;

export const imgOverlay = async (
  imgA: HTMLImageElement,
  imgB: HTMLImageElement,
  canvasDiff: HTMLCanvasElement
): Promise<number> => {
  const ctxA = createCanvasElement(imgA);
  const ctxB = createCanvasElement(imgB);
  canvasDiff.width = imgA.width;
  canvasDiff.height = imgA.height;
  const diffCtx = canvasDiff.getContext("2d");
  if (!diffCtx) throw Error("Couldn't get diff 2d context");
  const diff = diffCtx.createImageData(imgA.width, imgA.height);
  const options = await getOptions();
  const mismatchedPixels = pixelmatch(
    ctxA.getImageData(0, 0, imgA.width, imgA.height).data,
    ctxB.getImageData(0, 0, imgB.width, imgB.height).data,
    diff.data,
    imgA.width,
    imgA.height,
    { threshold: 0, alpha: 0.9, diffColor: hex2rgb(options.diffColor) }
  );
  diffCtx.putImageData(diff, 0, 0);
  return mismatchedPixels;
};

const getOptions = async () => {
  return await chrome.storage.sync.get({ diffColor: "#AAFF00" });
};

const hex2rgb = (hex: string): RGBTuple => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // return {r, g, b}
  return [r, g, b];
};

export const imgDiff = async (
  imgA: HTMLImageElement,
  imgB: HTMLImageElement,
  canvasDiff: HTMLCanvasElement
): Promise<number> => {
  const ctxA = createCanvasElement(imgA);
  const ctxB = createCanvasElement(imgB);
  canvasDiff.width = imgA.width;
  canvasDiff.height = imgA.height;
  const diffCtx = canvasDiff.getContext("2d");
  if (!diffCtx) throw Error("Couldn't get diff 2d context");
  const diff = diffCtx.createImageData(imgA.width, imgA.height);
  const options = await getOptions();
  const mismatchedPixels = pixelmatch(
    ctxA.getImageData(0, 0, imgA.width, imgA.height).data,
    ctxB.getImageData(0, 0, imgB.width, imgB.height).data,
    diff.data,
    imgA.width,
    imgA.height,
    { threshold: 0, diffMask: true, diffColor: hex2rgb(options.diffColor) }
  );
  diffCtx.putImageData(diff, 0, 0);
  return mismatchedPixels;
};

export const createDifferenceElement = async (
  viewElement: HTMLDivElement,
  imgA: HTMLImageElement,
  imgB: HTMLImageElement
) => {
  const canvasDiff = document.createElement("canvas");
  const mismatchedPixels = await imgDiff(imgA, imgB, canvasDiff);
  const newDiv = document.createElement("div");
  newDiv.textContent = `Mismatched pixels: ${mismatchedPixels}`;
  newDiv.setAttribute("class", "diff-frame");
  const diffWidth = Math.min(imgA.width, MAX_WIDTH);
  const diffHeight =
    imgA.width <= MAX_WIDTH
      ? imgA.height
      : (imgA.height / imgA.width) * MAX_WIDTH;

  newDiv.setAttribute(
    "style",
    `width: ${diffWidth}px; height: ${diffHeight}px;`
  );
  viewElement.setAttribute(
    "style",
    viewElement.getAttribute("style")! +
      `width: ${diffWidth}px; height: ${diffHeight}px;`
  );

  // add position relative and margin 0 auto to new div and viewElement
  newDiv.style.position = "relative";
  newDiv.style.margin = "0 auto";
  viewElement.style.paddingBottom = "30px";
  viewElement.style.position = "relative";
  viewElement.style.margin = "0 auto";

  // Wrap canvas in img
  const img = document.createElement("img");
  img.src = canvasDiff.toDataURL();
  // add overflow-clip-margin: content-box; and overflow: clip; to image
  img.style.overflowClipMargin = "content-box";
  img.style.overflow = "clip";
  img.style.width = diffWidth + "px";
  img.style.height = diffHeight + "px";

  newDiv.appendChild(img);
  viewElement.appendChild(newDiv);
};

export const createOverlayElement = async (
  viewElement: HTMLDivElement,
  imgA: HTMLImageElement,
  imgB: HTMLImageElement
) => {
  const canvasDiff = document.createElement("canvas");
  const mismatchedPixels = await imgOverlay(imgA, imgB, canvasDiff);
  const newDiv = document.createElement("div");
  newDiv.textContent = `Mismatched pixels: ${mismatchedPixels}`;
  newDiv.setAttribute("class", "diff-frame");
  const diffWidth = Math.min(imgA.width, MAX_WIDTH);
  const diffHeight =
    imgA.width <= MAX_WIDTH
      ? imgA.height
      : (imgA.height / imgA.width) * MAX_WIDTH;

  newDiv.setAttribute(
    "style",
    `width: ${diffWidth}px; height: ${diffHeight}px;`
  );
  viewElement.setAttribute(
    "style",
    viewElement.getAttribute("style")! +
      `width: ${diffWidth}px; height: ${diffHeight}px;`
  );

  // add position relative and margin 0 auto to new div and viewElement
  newDiv.style.position = "relative";
  newDiv.style.margin = "0 auto";
  viewElement.style.paddingBottom = "30px";
  viewElement.style.position = "relative";
  viewElement.style.margin = "0 auto";

  // Wrap canvas in img
  const img = document.createElement("img");
  img.src = canvasDiff.toDataURL();
  // add overflow-clip-margin: content-box; and overflow: clip; to image
  img.style.overflowClipMargin = "content-box";
  img.style.overflow = "clip";
  img.style.width = diffWidth + "px";
  img.style.height = diffHeight + "px";

  newDiv.appendChild(img);
  viewElement.appendChild(newDiv);
};

export const algos: Algo[] = [
  {
    name: "Difference",
    func: createDifferenceElement,
  },
  {
    name: "Overlay",
    func: createOverlayElement,
  },
];
