import { addNewViewElement, loadImage } from "../utils";
import { algos } from "../algos";

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
      console.log(loadedImageA, loadedImageB);
      algos.forEach((algo) => {
        const diffElement = addNewViewElement(mainElement, algo.name);
        if (
          !diffElement ||
          loadedImageA.width !== loadedImageB.width ||
          loadedImageA.height !== loadedImageB.height
        )
          return;
        algo.func(diffElement, loadedImageA, loadedImageB);
      });
    }
  );
}

main();
