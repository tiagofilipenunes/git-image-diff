import pixelmatch, { RGBTuple } from "pixelmatch";
import { createCanvasElement, type Algo } from "../logic";
import "./style.css";

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
    { threshold: 0, alpha: 0.9, diffColor: hex2rgb(String(options.diffColor)) }
  );
  diffCtx.putImageData(diff, 0, 0);
  return mismatchedPixels;
};

const getOptions = async () => {
  try {
    return await browser.storage.sync.get({ diffColor: "#AAFF00" });
  } catch (r) {
    throw new Error(`Color options could not be retrieved. Error: ${r}`);
  }
};

const hex2rgb = (hex: string): RGBTuple => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
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
    {
      threshold: 0,
      diffMask: true,
      diffColor: hex2rgb(String(options.diffColor)),
    }
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
  const diffWidth = Math.min(imgA.width, MAX_WIDTH);
  const diffHeight =
    imgA.width <= MAX_WIDTH
      ? imgA.height
      : (imgA.height / imgA.width) * MAX_WIDTH;

  // Style newDiv and viewElements
  newDiv.style.setProperty("--diff-width", `${diffWidth}px`);
  newDiv.style.setProperty("--diff-height", `${diffHeight}px`);
  newDiv.classList.add("diff-frame");
  viewElement.style.setProperty("--diff-width", `${diffWidth}px`);
  viewElement.style.setProperty("--diff-height", `${diffHeight}px`);
  viewElement.classList.add("viewElement");

  // Wrap canvas in img
  const img = document.createElement("img");
  img.src = canvasDiff.toDataURL();

  // Set image style
  img.style.setProperty("--diff-width", `${diffWidth}px`);
  img.style.setProperty("--diff-height", `${diffHeight}px`);
  img.classList.add("diffImage");

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
  const diffWidth = Math.min(imgA.width, MAX_WIDTH);
  const diffHeight =
    imgA.width <= MAX_WIDTH
      ? imgA.height
      : (imgA.height / imgA.width) * MAX_WIDTH;

  // Style newDiv and viewElements
  newDiv.style.setProperty("--diff-width", `${diffWidth}px`);
  newDiv.style.setProperty("--diff-height", `${diffHeight}px`);
  newDiv.classList.add("diff-frame");
  newDiv.classList.add("diffView");
  viewElement.style.setProperty("--diff-width", `${diffWidth}px`);
  viewElement.style.setProperty("--diff-height", `${diffHeight}px`);
  viewElement.classList.add("viewElement");

  // Wrap canvas in img
  const img = document.createElement("img");
  img.src = canvasDiff.toDataURL();

  // Set image style
  img.style.setProperty("--diff-width", `${diffWidth}px`);
  img.style.setProperty("--diff-height", `${diffHeight}px`);
  img.classList.add("diffImage");

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
