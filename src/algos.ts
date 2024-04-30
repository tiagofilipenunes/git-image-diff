import pixelmatch from "pixelmatch";
import { createCanvasElement } from "./utils";

const MAX_WIDTH = 414;

export function imgDiff(
  imgA: HTMLImageElement,
  imgB: HTMLImageElement,
  canvasDiff: HTMLCanvasElement
): number {
  const ctxA = createCanvasElement(imgA);
  const ctxB = createCanvasElement(imgB);
  canvasDiff.width = imgA.width;
  canvasDiff.height = imgA.height;
  const diffCtx = canvasDiff.getContext("2d");
  if (!diffCtx) throw Error("Couldn't get diff 2d context");
  const diff = diffCtx.createImageData(imgA.width, imgA.height);
  const mismatchedPixels = pixelmatch(
    ctxA.getImageData(0, 0, imgA.width, imgA.height).data,
    ctxB.getImageData(0, 0, imgB.width, imgB.height).data,
    diff.data,
    imgA.width,
    imgA.height,
    { threshold: 0.1 }
  );
  diffCtx.putImageData(diff, 0, 0);
  return mismatchedPixels;
}

export function createDifferenceElement(
  viewElement: HTMLDivElement,
  imgA: HTMLImageElement,
  imgB: HTMLImageElement
) {
  const canvasDiff = document.createElement("canvas");
  const mismatchedPixels = imgDiff(imgA, imgB, canvasDiff);
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
}
