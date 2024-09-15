import { algos, getSettings } from "../logic";

const saveSettings = () => {
  let newOptions = {};

  const color = document.getElementById("color") as HTMLInputElement;
  if (color) newOptions = { ...newOptions, diffColor: color.value };

  const defaultDiff = document.getElementById("algos") as HTMLSelectElement;
  newOptions = { ...newOptions, defaultAlgo: defaultDiff.value };

  browser.storage.sync.set(newOptions).catch((r) => {
    throw new Error(`Settings could not be saved. Error: ${r}`);
  });
};

const restoreSettings = async () => {
  const settings = await getSettings();
  (document.getElementById("color") as HTMLInputElement).value =
    settings.diffColor;

  algos.forEach((algo) => {
    const newOption = new Option(algo.name, algo.name);
    (document.getElementById("algos") as HTMLSelectElement).add(newOption);
  });

  if (settings.defaultAlgo)
    (document.getElementById("algos") as HTMLSelectElement).value =
      settings.defaultAlgo;
};

document.addEventListener("DOMContentLoaded", restoreSettings);
document.addEventListener("submit", (e) => {
  e.preventDefault();
  saveSettings();
});
