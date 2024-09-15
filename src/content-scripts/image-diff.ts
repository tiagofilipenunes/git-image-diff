import { addNewViewElement, loadImage, algos, findMainElement } from "../logic";

const processImages = async () => {
  const mainElement = findMainElement();
  const dataFileA = mainElement.getAttribute("data-file1");
  const dataFileB = mainElement.getAttribute("data-file2");
  if (!dataFileA || !dataFileB) throw Error("Couldn't get data URL");

  try {
    const [loadedImageA, loadedImageB] = await Promise.all([
      loadImage(dataFileA),
      loadImage(dataFileB),
    ]);

    await Promise.all(
      algos.map(async (algo) => {
        const diffElement = addNewViewElement(mainElement, algo.name);
        const isDiffSize =
          !diffElement ||
          loadedImageA.width !== loadedImageB.width ||
          loadedImageA.height !== loadedImageB.height;
        if (isDiffSize) return;

        algo.func(diffElement, loadedImageA, loadedImageB);
      })
    );
    console.log("Finished loading images");
  } catch (error) {
    console.error("Failed to load image for reason: ", error);
  }
};

processImages().then(() => {
  console.log("Processing complete");
});
