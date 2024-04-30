import { addNewViewElement, imgDiff, loadImage } from "../utils";

const MAX_WIDTH = 414;

async function main() {
  // Get div element with data-type="diff"
  const mainElements = Array.from(document.querySelectorAll("div"));
  const mainElement = mainElements.find(
    (mainElement) => mainElement.getAttribute("data-type") === "diff"
  );
  if (!mainElement) return;

  const dataFileA = mainElement.getAttribute("data-file1");
  const dataFileB = mainElement.getAttribute("data-file2");
  if (!dataFileA || !dataFileB) throw Error("Couldn't get data URL");

  Promise.all([loadImage(dataFileA), loadImage(dataFileB)]).then(
    ([loadedImageA, loadedImageB]) => {
      const diffElement = addNewViewElement(mainElement, "Difference");
      if (!diffElement) return;

      console.log(loadedImageA, loadedImageB);
      const canvasDiff = document.createElement("canvas");
      const mismatchedPixels = imgDiff(loadedImageA, loadedImageB, canvasDiff);
      const newDiv = document.createElement("div");
      newDiv.textContent = `Mismatched pixels: ${mismatchedPixels}`;
      newDiv.setAttribute("class", "diff-frame");
      const diffWidth = Math.min(loadedImageA.width, MAX_WIDTH);
      const diffHeight =
        loadedImageA.width <= MAX_WIDTH
          ? loadedImageA.height
          : (loadedImageA.height / loadedImageA.width) * MAX_WIDTH;

      newDiv.setAttribute(
        "style",
        `width: ${diffWidth}px; height: ${diffHeight}px;`
      );
      diffElement.setAttribute(
        "style",
        diffElement.getAttribute("style")! +
          `width: ${diffWidth}px; height: ${diffHeight}px;`
      );

      // add position relative and margin 0 auto to new div and diffElement
      newDiv.style.position = "relative";
      newDiv.style.margin = "0 auto";
      diffElement.style.paddingBottom = "30px";
      diffElement.style.position = "relative";
      diffElement.style.margin = "0 auto";

      // Wrap canvas in img
      const img = document.createElement("img");
      img.src = canvasDiff.toDataURL();
      // add overflow-clip-margin: content-box; and overflow: clip; to image
      img.style.overflowClipMargin = "content-box";
      img.style.overflow = "clip";
      img.style.width = diffWidth + "px";
      img.style.height = diffHeight + "px";

      newDiv.appendChild(img);
      diffElement.appendChild(newDiv);
    }
  );
}

main();
