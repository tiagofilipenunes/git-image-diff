import { getSettings } from "./utils";

export class ZoomManipulator {
  /**
   * Ease position to allow the user to view past edges
   * when the magnified image is clipped due to the iframe
   * @param percent number between 0 and 100%
   *  */
  easePosition(percent: number) {
    const t = (percent - 50) / 50;
    return 50 + 65 * Math.pow(t, 3);
  }

  async addZommer() {
    const {
      zoomSettings: { enableZoom, zoomIncreasePerc },
    } = await getSettings();
    if (!enableZoom) {
      return;
    }

    const imageBoxes: HTMLDivElement[] = Array.from(
      document.querySelectorAll(".diffView"),
    );
    if (imageBoxes.length === 0) {
      throw new Error("Could not find image boxes to zoom into");
    }

    for (const imageBox of imageBoxes) {
      imageBox.classList.add("zoomerBox");
      const originalImage =
        imageBox.querySelector<HTMLImageElement>(".diffImage");

      if (!originalImage) {
        throw new Error("Could not find original image");
      }

      // Add magnified image
      const magnified = document.createElement("div");
      magnified.classList.add("magnifiedImg");
      magnified.style.backgroundImage = `url("${originalImage.src}")`;
      magnified.style.backgroundSize = `${zoomIncreasePerc}%`;
      imageBox.appendChild(magnified);

      const zoom = zoomIncreasePerc / 100;

      imageBox.addEventListener("mousemove", (e) => {
        const style = magnified.style;
        const x = e.pageX - imageBox.offsetLeft;
        const y = e.pageY - imageBox.offsetTop;
        const imgWidth = originalImage.offsetWidth;
        const imgHeight = originalImage.offsetHeight;
        let xperc = (x / imgWidth) * 100;
        let yperc = (y / imgHeight) * 100;
        const zoomedWidth = originalImage.offsetWidth * zoom;
        const zoomedHeight = originalImage.offsetHeight * zoom;

        // Percentage equivalent of half the lens
        const xOvershoot = (magnified.offsetWidth / 2 / zoomedWidth) * 100;
        const yOvershoot = (magnified.offsetHeight / 2 / zoomedHeight) * 100;

        const scaledXperc = this.easePosition(
          xperc * ((100 + xOvershoot * 2) / 100) - xOvershoot,
        );
        const scaledYperc = this.easePosition(
          yperc * ((100 + yOvershoot * 2) / 100) - yOvershoot,
        );

        style.backgroundPositionX = `${scaledXperc}%`;
        style.backgroundPositionY = `${scaledYperc}%`;
        style.left = `${x - 180}px`;
        style.top = `${y - 180}px`;
      });
    }
  }
}
