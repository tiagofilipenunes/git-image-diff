import { IFrameManipulator } from "./imageManipulator";
import { ImageComparisonFactory, ZoomManipulator, algoNames } from "../logic";

const processImages = async () => {
  try {
    const iFrameManipulator = new IFrameManipulator();
    const [loadedImageA, loadedImageB] = await iFrameManipulator.loadImages();
    console.debug("Finished loading images");

    await Promise.all(
      algoNames.map(async (algoName) => {
        const algo = ImageComparisonFactory.createAlgo(
          algoName,
          loadedImageA,
          loadedImageB,
        );
        if (!algo.isValidAlgo()) return;
        const diffElement = iFrameManipulator.addNewViewElement(algoName);
        await algo.createViewElement(diffElement);
      }),
    );

    const zoomManipulator = new ZoomManipulator();
    await zoomManipulator.addZommer();

    console.debug("Processing complete");
  } catch (error) {
    console.error("Failed to load image for reason: ", error);
  }
};

processImages();
