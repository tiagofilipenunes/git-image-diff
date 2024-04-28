// Get all 'a' elements in the document
const divElements = document.querySelectorAll("div");

// Iterate over each 'a' element
divElements.forEach((divElement) => {
  // find div element with data-type="diff"
  if (divElement.getAttribute("data-type") !== "diff") return;

  // Get data-file1 and data-file2 and download them
  const dataFile1 = divElement.getAttribute("data-file1");
  const dataFile2 = divElement.getAttribute("data-file2");
  if (!dataFile1 || !dataFile2) return;
  const file1Url = fetch(dataFile1)
    .then((res) => res.blob())
    .then((blob) => URL.createObjectURL(blob));
  const file2Url = fetch(dataFile1)
    .then((res) => res.blob())
    .then((blob) => URL.createObjectURL(blob));

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

  // Wait for promises to resolve
  Promise.all([file1Url, file2Url]).then(([file1Url, file2Url]) => {
    diffElement.innerHTML = "Difference between images";
    console.log(file1Url, file2Url);
  });
});
