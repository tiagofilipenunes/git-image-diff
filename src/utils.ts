import pixelmatch from "pixelmatch";

export function addNewViewElement(
  mainElement: HTMLDivElement,
  newElementName: string
) {
  const id = newElementName.replace(" ", "-").toLowerCase();

  // Add new view element
  const diffElement = document.createElement("div");
  diffElement.setAttribute("class", `${id}-skin view`);
  diffElement.setAttribute("style", "display: none;");
  const lastElement = mainElement.lastElementChild;
  if (!lastElement) return;
  mainElement.insertBefore(diffElement, lastElement);

  // Find ul element
  const ulElement = mainElement.querySelector("ul");
  if (!ulElement) return;

  // Append new li elements
  const newLiElement = document.createElement("li");
  newLiElement.textContent = newElementName;
  newLiElement.setAttribute("class", "js-view-mode-item");
  newLiElement.setAttribute("data-mode", `${id}-skin`);
  ulElement.appendChild(newLiElement);

  return diffElement;
}

function createCanvasElement(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Couldn't get 2d context");
  ctx.drawImage(img, 0, 0);
  return ctx;
}

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

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.setAttribute("crossOrigin", "");
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
