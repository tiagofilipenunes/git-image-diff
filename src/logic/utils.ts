const selectView = (id: string) => {
  const mainElements = Array.from(document.querySelectorAll("div"));
  const mainElement = mainElements.find(
    (mainElement) => mainElement.getAttribute("data-type") === "diff"
  );
  if (!mainElement) return;
  const viewElements = Array.from(mainElement.children);
  viewElements.forEach((child) => {
    const childStyle = child.getAttribute("style");
    if (!childStyle) return;
    if (child.getAttribute("class")?.includes(id)) {
      child.setAttribute(
        "style",
        childStyle?.replace("display: none;", "display: block;")
      );
    } else {
      child.setAttribute(
        "style",
        childStyle?.replace("display: block;", "display: none;")
      );
    }
  });
};

// Get all fieldset label children
const selectFieldset = (textNode: string) => {
  const mainElements = Array.from(document.querySelectorAll("div"));
  const mainElement = mainElements.find(
    (mainElement) => mainElement.getAttribute("data-type") === "diff"
  );
  if (!mainElement) return;
  const fieldSetElements = mainElement.querySelector("fieldset");
  if (!fieldSetElements) return;
  const fieldSetLabelChildren = Array.from(fieldSetElements.children);
  fieldSetLabelChildren.forEach((child) => {
    if (child.textContent?.includes(textNode)) {
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
  const blob: Blob = await browser.runtime.sendMessage({
    action: "loadImage",
    src,
  });

  return URL.createObjectURL(blob);
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
    img.src = await getImageSource(src);
  });
};
