import pixelmatch, { PixelmatchOptions } from "pixelmatch";
import {
  type AlgoName,
  createCanvasElement,
  getSettings,
  hex2rgb,
} from "../logic";
import "./style.css";

const MAX_WIDTH = 414;

abstract class ImageComparisonAlgo {
  constructor(
    protected imgA: HTMLImageElement,
    protected imgB: HTMLImageElement
  ) {}

  abstract isValidAlgo(): boolean;
  abstract createViewElement(viewElement: HTMLDivElement): void | Promise<void>;
}

class DifferenceAlgo extends ImageComparisonAlgo {
  isValidAlgo = () => {
    const isSameSize =
      this.imgA.width === this.imgB.width &&
      this.imgA.height === this.imgB.height;
    return isSameSize;
  };

  createViewElement = async (viewElement: HTMLDivElement) => {
    const settings = await getSettings();
    const diffColor = hex2rgb(String(settings.diffColor));
    const canvasDiff = document.createElement("canvas");
    const mismatchedPixels = createDiffOnCanvas(
      this.imgA,
      this.imgB,
      canvasDiff,
      {
        threshold: 0.01,
        diffMask: true,
        diffColor,
        aaColor: diffColor,
        includeAA: false,
      }
    );
    const newDiv = document.createElement("div");
    newDiv.textContent = `Mismatched pixels: ${mismatchedPixels}`;
    const diffWidth = Math.min(this.imgA.width, MAX_WIDTH);
    const diffHeight =
      this.imgA.width <= MAX_WIDTH
        ? this.imgA.height
        : (this.imgA.height / this.imgA.width) * MAX_WIDTH;

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
}

class OverlayAlgo extends ImageComparisonAlgo {
  isValidAlgo = () => {
    const isSameSize =
      this.imgA.width === this.imgB.width &&
      this.imgA.height === this.imgB.height;
    return isSameSize;
  };

  async createViewElement(viewElement: HTMLDivElement) {
    const settings = await getSettings();
    const diffColor = hex2rgb(String(settings.diffColor));
    const canvasDiff = document.createElement("canvas");
    const mismatchedPixels = createDiffOnCanvas(
      this.imgA,
      this.imgB,
      canvasDiff,
      {
        threshold: 0.01,
        alpha: 0.9,
        diffColor,
        aaColor: diffColor,
        includeAA: false,
      }
    );
    const newDiv = document.createElement("div");
    newDiv.textContent = `Mismatched pixels: ${mismatchedPixels}`;
    const diffWidth = Math.min(this.imgA.width, MAX_WIDTH);
    const diffHeight =
      this.imgA.width <= MAX_WIDTH
        ? this.imgA.height
        : (this.imgA.height / this.imgA.width) * MAX_WIDTH;

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
  }
}

export const createDiffOnCanvas = (
  imgA: HTMLImageElement,
  imgB: HTMLImageElement,
  canvasElement: HTMLCanvasElement,
  options: PixelmatchOptions
): number => {
  const ctxA = createCanvasElement(imgA);
  const ctxB = createCanvasElement(imgB);
  canvasElement.width = imgA.width;
  canvasElement.height = imgA.height;
  const diffCtx = canvasElement.getContext("2d");
  if (!diffCtx) throw Error("Couldn't get diff 2d context");
  const diff = diffCtx.createImageData(imgA.width, imgA.height);
  const mismatchedPixels = pixelmatch(
    ctxA.getImageData(0, 0, imgA.width, imgA.height).data,
    ctxB.getImageData(0, 0, imgB.width, imgB.height).data,
    diff.data,
    imgA.width,
    imgA.height,
    options
  );
  diffCtx.putImageData(diff, 0, 0);
  return mismatchedPixels;
};

export class ImageComparisonFactory {
  static createAlgo(
    algoName: AlgoName,
    imgA: HTMLImageElement,
    imgB: HTMLImageElement
  ): ImageComparisonAlgo {
    switch (algoName) {
      case "difference":
        return new DifferenceAlgo(imgA, imgB);
      case "overlay":
        return new OverlayAlgo(imgA, imgB);
    }
  }
}

export const algoNames: AlgoName[] = ["difference", "overlay"];
