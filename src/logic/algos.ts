import pixelmatch from "pixelmatch";
import {
  type AlgoName,
  createCanvasElement,
  getSettings,
  PixelmatchSettings,
} from "../logic";
import "./style.css";

const MIN_WIDTH = 100; //px
const MAX_WIDTH = 1200; //px
const MIN_HEIGHT = 100; //px
const MAX_HEIGHT = 885; //px
const BOTTOM_BUFFER = 90; //px

abstract class ImageComparisonAlgo {
  constructor(
    protected imgA: HTMLImageElement,
    protected imgB: HTMLImageElement,
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
    const { pixelmatchSettings } = await getSettings();
    const canvasDiff = document.createElement("canvas");
    const mismatchedPixels = createDiffOnCanvas(
      this.imgA,
      this.imgB,
      canvasDiff,
      pixelmatchSettings,
    );
    const pixelMismatchDiv = createPixelMatchView(mismatchedPixels);
    const newDiv = document.createElement("div");
    const { diffWidth, diffHeight } = getDiffSize(this.imgA);

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
    viewElement.appendChild(pixelMismatchDiv);
    viewElement.appendChild(newDiv);
    viewElement.dataset.renderHeight = `${Math.ceil(
      diffHeight + BOTTOM_BUFFER,
    )}`;
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
    const { pixelmatchSettings } = await getSettings();

    // Create a canvas for the new image
    const baseCanvas = document.createElement("canvas");
    baseCanvas.width = this.imgB.width;
    baseCanvas.height = this.imgB.height;
    const baseCtx = baseCanvas.getContext("2d");
    if (!baseCtx) throw Error("Couldn't get base canvas 2d context");

    // Draw the new image
    baseCtx.drawImage(this.imgB, 0, 0);

    // Create a canvas for the diff
    const canvasDiff = document.createElement("canvas");
    const mismatchedPixels = createDiffOnCanvas(
      this.imgA,
      this.imgB,
      canvasDiff,
      pixelmatchSettings,
    );

    // Overlay the diff on top of the new image with transparency
    baseCtx.globalAlpha = 0.5;
    baseCtx.drawImage(canvasDiff, 0, 0);

    const pixelMismatchDiv = createPixelMatchView(mismatchedPixels);
    const newDiv = document.createElement("div");
    const { diffWidth, diffHeight } = getDiffSize(this.imgB);

    // Style newDiv and viewElements
    newDiv.style.setProperty("--diff-width", `${diffWidth}px`);
    newDiv.style.setProperty("--diff-height", `${diffHeight}px`);
    newDiv.classList.add("diff-frame");
    newDiv.classList.add("diffView");
    viewElement.style.setProperty("--diff-width", `${diffWidth}px`);
    viewElement.style.setProperty("--diff-height", `${diffHeight}px`);
    viewElement.classList.add("viewElement");

    // Use the combined base+diff image
    const img = document.createElement("img");
    img.src = baseCanvas.toDataURL();

    // Set image style
    img.style.setProperty("--diff-width", `${diffWidth}px`);
    img.style.setProperty("--diff-height", `${diffHeight}px`);
    img.classList.add("diffImage");

    newDiv.appendChild(img);
    viewElement.appendChild(pixelMismatchDiv);
    viewElement.appendChild(newDiv);
    viewElement.dataset.renderHeight = `${Math.ceil(
      diffHeight + BOTTOM_BUFFER,
    )}`;
  }
}

/**
 * scales the image width and height UP so BOTH are at less than a corresponding MINIMUM width and height
 * scales the image width and height DOWN so NONE are larger than a corresponding MAXIMUM width and height
 *
 * if image is both too small on one measure but too large on the other, prefer downscaling it
 *
 * @param image image to scale
 * @returns new image width and height
 */
const getDiffSize = (image: HTMLImageElement) => {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;

  const minScale = Math.max(MIN_WIDTH / sourceWidth, MIN_HEIGHT / sourceHeight);
  const maxScale = Math.min(MAX_WIDTH / sourceWidth, MAX_HEIGHT / sourceHeight);

  let scale = 1;
  // Image is too large
  if (maxScale < 1) {
    scale = maxScale;
    // Image is too small
  } else if (minScale > 1) {
    scale = minScale;
  }

  const diffWidth = sourceWidth * scale;
  const diffHeight = sourceHeight * scale;

  return { diffWidth, diffHeight };
};

export const createDiffOnCanvas = (
  imgA: HTMLImageElement,
  imgB: HTMLImageElement,
  canvasElement: HTMLCanvasElement,
  options: PixelmatchSettings,
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
    options,
  );
  diffCtx.putImageData(diff, 0, 0);
  return mismatchedPixels;
};

const createPixelMatchView = (mismatchedPixels: number) => {
  const pixelMismatchDiv = document.createElement("div");
  pixelMismatchDiv.classList.add("pixelMismatchView");
  pixelMismatchDiv.textContent = `Mismatched pixels: ${mismatchedPixels}px`;
  return pixelMismatchDiv;
};

export class ImageComparisonFactory {
  static createAlgo(
    algoName: AlgoName,
    imgA: HTMLImageElement,
    imgB: HTMLImageElement,
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
