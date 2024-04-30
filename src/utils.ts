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

export function createCanvasElement(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Couldn't get 2d context");
  ctx.drawImage(img, 0, 0);
  return ctx;
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
