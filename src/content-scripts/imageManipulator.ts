import { RequestResponse } from "../logic";
import { capitalizeFirstLetter, getSettings } from "../logic/utils";

export class IFrameManipulator {
  mainElement: HTMLDivElement;

  constructor() {
    this.mainElement = this.findMainElement();
  }

  private findMainElement = (): HTMLDivElement => {
    const mainElements = Array.from(document.querySelectorAll("div"));
    const mainElement = mainElements.find(
      (mainElement) => mainElement.getAttribute("data-type") === "diff"
    );
    if (!mainElement) throw Error("Main Element not found");
    return mainElement;
  };

  private selectView = (id: string) => {
    const viewElements = Array.from(this.mainElement.children) as HTMLElement[];
    if (!viewElements.length) throw Error("View Elements not found");
    viewElements.forEach((child) => {
      const childStyle = child.getAttribute("style");
      if (!childStyle) return;
      if (
        child.getAttribute("class")?.toLowerCase().includes(id.toLowerCase())
      ) {
        child.style.setProperty("display", "block");
      } else {
        child.style.setProperty("display", "none");
      }
    });
  };

  private clickFieldset = (textNode: string) => {
    const fieldSetElement = this.mainElement.querySelector("fieldset");
    if (!fieldSetElement) throw Error("Fieldset Element not found");
    const fieldSetLabelChildren = Array.from(
      fieldSetElement.children
    ) as HTMLElement[];
    fieldSetLabelChildren.forEach((child) => {
      if (child.textContent?.toLowerCase().includes(textNode.toLowerCase())) {
        // Simulate clicking on the specified element.
        child.dispatchEvent(new Event("mousedown"));
        child.click();
      }
    });
  };

  private selectFieldset = (textNode: string) => {
    const fieldSetElement = this.mainElement.querySelector("fieldset");
    if (!fieldSetElement) throw Error("Fieldset Element not found");
    const fieldSetLabelChildren = Array.from(fieldSetElement.children);
    fieldSetLabelChildren.forEach((child) => {
      if (child.textContent?.toLowerCase().includes(textNode.toLowerCase())) {
        child.setAttribute("class", "js-view-mode selected");
      } else {
        child.setAttribute("class", "js-view-mode");
      }
    });
  };

  private getImageSource = async (src: string) => {
    const loadImageResponse: RequestResponse =
      await browser.runtime.sendMessage({
        action: "loadImage",
        src,
      });
    if (!loadImageResponse.success) throw new Error("Could not load image");
    return loadImageResponse.response;
  };

  private getDataFileURL = () => {
    const dataFileA = this.mainElement.getAttribute("data-file1");
    const dataFileB = this.mainElement.getAttribute("data-file2");
    if (!dataFileA || !dataFileB) throw Error("Couldn't get data-file URL");
    return [dataFileA, dataFileB];
  };

  private loadImage = async (src: string): Promise<HTMLImageElement> => {
    return new Promise(async (resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.setAttribute("crossOrigin", "");
      img.onload = () => resolve(img);
      img.onerror = (error) => {
        console.error("Failed to load image for reason:", error);
        reject(error);
      };
      // Firefox requires images to be loaded in a background script
      img.src = await this.getImageSource(src);
    });
  };

  loadImages = async () => {
    const [dataFileA, dataFileB] = this.getDataFileURL();
    return Promise.all([this.loadImage(dataFileA), this.loadImage(dataFileB)]);
  };

  addNewViewElement = (algoName: string): HTMLDivElement => {
    const id = algoName.replace(" ", "-").toLowerCase();

    // Add new view element
    const diffElement = document.createElement("div");
    diffElement.setAttribute("class", `${id}-skin view`);
    diffElement.setAttribute("style", "display: none;");
    const lastElement = this.mainElement.lastElementChild;
    if (!lastElement)
      throw Error("Couldn't get last element from main element");
    this.mainElement.insertBefore(diffElement, lastElement);

    // Find fieldset element
    const fieldSetElements = this.mainElement.querySelector("fieldset");
    if (!fieldSetElements)
      throw Error("Couldn't get fieldset elements from main element");

    // Append new label elements
    const newLabelElement = document.createElement("label");
    newLabelElement.setAttribute("class", "js-view-mode");
    const newTextElement = document.createTextNode(
      capitalizeFirstLetter(algoName)
    );
    const newLabelInputElement = document.createElement("input");
    newLabelInputElement.setAttribute("name", "view-mode");
    newLabelInputElement.setAttribute("type", "radio");
    newLabelInputElement.setAttribute("value", `${id}-skin`);

    newLabelInputElement.onclick = () => {
      this.selectFieldset(algoName);
      this.selectView(id);
    };

    newLabelElement.appendChild(newLabelInputElement);
    newLabelElement.appendChild(newTextElement);
    fieldSetElements.appendChild(newLabelElement);

    return diffElement;
  };

  setDefaultView = async () => {
    const settings = await getSettings();
    const algoName = settings.defaultAlgo;
    if (!algoName) return;
    this.selectFieldset(algoName);
    this.selectView(algoName);
    // Wait 1 sec to allow views to load
    setTimeout(() => {
      this.clickFieldset(algoName);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1000);
  };
}

const iFrameManipulator = new IFrameManipulator();
window.onload = iFrameManipulator.setDefaultView;
