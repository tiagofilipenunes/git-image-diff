import { RequestResponse, Settings } from "./types";

export const findMainElement = () => {
  const mainElements = Array.from(document.querySelectorAll("div"));
  const mainElement = mainElements.find(
    (mainElement) => mainElement.getAttribute("data-type") === "diff"
  );
  if (!mainElement) throw Error("Main Element not found");
  return mainElement;
};

const selectView = (id: string) => {
  const mainElement = findMainElement();
  const viewElements = Array.from(mainElement.children) as HTMLElement[];
  if (!viewElements.length) throw Error("View Elements not found");
  viewElements.forEach((child) => {
    const childStyle = child.getAttribute("style");
    if (!childStyle) return;
    if (child.getAttribute("class")?.toLowerCase().includes(id.toLowerCase())) {
      child.style.setProperty("display", "block");
    } else {
      child.style.setProperty("display", "none");
    }
  });
};

const clickFieldset = (textNode: string) => {
  const mainElement = findMainElement();
  const fieldSetElement = mainElement.querySelector("fieldset");
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

const selectFieldset = (textNode: string) => {
  const mainElement = findMainElement();
  const fieldSetElement = mainElement.querySelector("fieldset");
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

export const addNewViewElement = (
  mainElement: HTMLDivElement,
  newElementName: string
) => {
  const id = newElementName.replace(" ", "-").toLowerCase();

  // Add new view element
  const diffElement = document.createElement("div");
  diffElement.setAttribute("class", `${id}-skin view`);
  diffElement.setAttribute("style", "display: none;");
  const lastElement = mainElement.lastElementChild;
  if (!lastElement) return;
  mainElement.insertBefore(diffElement, lastElement);

  // Find fieldset element
  const fieldSetElements = mainElement.querySelector("fieldset");
  if (!fieldSetElements) return;

  // Append new label elements
  const newLabelElement = document.createElement("label");
  newLabelElement.setAttribute("class", "js-view-mode");
  const newTextElement = document.createTextNode(newElementName);
  const newLabelInputElement = document.createElement("input");
  newLabelInputElement.setAttribute("name", "view-mode");
  newLabelInputElement.setAttribute("type", "radio");
  newLabelInputElement.setAttribute("value", `${id}-skin`);

  newLabelInputElement.onclick = () => {
    selectFieldset(newElementName);
    selectView(id);
  };

  newLabelElement.appendChild(newLabelInputElement);
  newLabelElement.appendChild(newTextElement);
  fieldSetElements.appendChild(newLabelElement);

  return diffElement;
};

export const createCanvasElement = (img: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Couldn't get 2d context");
  ctx.drawImage(img, 0, 0);
  return ctx;
};

async function getImageSource(src: string) {
  const loadImageResponse: RequestResponse = await browser.runtime.sendMessage({
    action: "loadImage",
    src,
  });
  if (!loadImageResponse.success) throw new Error("Could not load image");
  return loadImageResponse.response;
}

export const loadImage = (src: string): Promise<HTMLImageElement> => {
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
    img.src = await getImageSource(src);
  });
};

export const defaultSettings: Settings = {
  diffColor: "#AAFF00",
  defaultAlgo: "",
};

export const getSettings = async (): Promise<Settings> => {
  try {
    return browser.storage.sync.get(defaultSettings) as Promise<Settings>;
  } catch (r) {
    throw new Error(`Settings could not be retrieved. Error: ${r}`);
  }
};

export const setDefaultView = async () => {
  const settings = await getSettings();
  const algoName = settings.defaultAlgo;
  if (!algoName) return;
  selectFieldset(algoName);
  selectView(algoName);
  // Wait 1 sec to allow views to load
  setTimeout(() => clickFieldset(algoName), 1000);
};

window.onload = setDefaultView;
