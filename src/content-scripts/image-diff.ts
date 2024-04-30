import pixelmatch from "pixelmatch";

// Get all 'a' elements in the document
const divElements = document.querySelectorAll("div");

// Iterate over each 'a' element
divElements.forEach((divElement) => {
  // find div element with data-type="diff"
  if (divElement.getAttribute("data-type") !== "diff") return;

  // Add new view element
  const diffElement = document.createElement("div");
  diffElement.setAttribute("class", "diff-skin view");
  diffElement.setAttribute("style", "display: none;");
  const lastElement = divElement.lastElementChild;
  if (!lastElement) return;
  divElement.insertBefore(diffElement, lastElement);

  // Find ul element
  const ulElement = divElement.querySelector("ul");
  if (!ulElement) return;

  // Append new li elements
  const newLiElement = document.createElement("li");
  newLiElement.textContent = "Difference";
  newLiElement.setAttribute("class", "js-view-mode-item");
  newLiElement.setAttribute("data-mode", "diff-skin");
  ulElement.appendChild(newLiElement);

  const createCanvasElement = (img: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw Error("Couldn't get 2d context");
    ctx.drawImage(img, 0, 0);
    return ctx;
  };

  const imgDiff = (
    imgA: HTMLImageElement,
    imgB: HTMLImageElement,
    canvasDiff: HTMLCanvasElement
  ): number => {
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
  };

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.setAttribute("crossOrigin", "");
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const dataFileA = divElement.getAttribute("data-file1");
  const dataFileB = divElement.getAttribute("data-file2");
  if (!dataFileA || !dataFileB) throw Error("Couldn't fetch data files");

  Promise.all([loadImage(dataFileA), loadImage(dataFileB)]).then(
    ([loadedImageA, loadedImageB]) => {
      console.log(loadedImageA, loadedImageB);
      const canvasDiff = document.createElement("canvas");
      const mismatchedPixels = imgDiff(loadedImageA, loadedImageB, canvasDiff);
      const newDiv = document.createElement("div");
      newDiv.textContent = `Mismatched pixels: ${mismatchedPixels}`;
      newDiv.setAttribute("class", "diff-frame");
      newDiv.setAttribute(
        "style",
        `width: ${loadedImageA.width}px; height: ${loadedImageA.height}px;`
      );
      diffElement.setAttribute(
        "style",
        diffElement.getAttribute("style")! +
          `width: ${loadedImageA.width}px; height: ${loadedImageA.height}px;`
      );

      // add position relative and margin 0 auto to new div and diffElement
      newDiv.style.position = "relative";
      newDiv.style.margin = "0 auto";
      diffElement.style.position = "relative";
      diffElement.style.margin = "0 auto";

      // add overflow-clip-margin: content-box; and overflow: clip; to canvas
      canvasDiff.style.overflowClipMargin = "content-box";
      canvasDiff.style.overflow = "clip";
      newDiv.appendChild(canvasDiff);
      diffElement.appendChild(newDiv);
      console.log(mismatchedPixels);
    }
  );
});
