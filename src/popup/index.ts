import {
  algoNames,
  capitalizeFirstLetter,
  getSettings,
  hex2rgb,
  defaultSettings,
} from "../logic";
import type { PixelmatchSettings, Settings } from "../logic/types";

// Show error
const showError = (error: Error) => {
  const errorDiv = document.getElementById("errorMessage");
  if (errorDiv) {
    errorDiv.textContent = JSON.stringify(error);
    errorDiv.style.display = "block";
  }
};

// Hide error
const hideError = () => {
  const errorDiv = document.getElementById("errorMessage");
  if (errorDiv) {
    errorDiv.style.display = "none";
  }
};

const getPixelmatchSettingsFromForm = (): PixelmatchSettings | Error => {
  try {
    const threshold = parseFloat(
      (document.getElementById("threshold") as HTMLInputElement).value
    );
    const alpha = parseFloat(
      (document.getElementById("alpha") as HTMLInputElement).value
    );
    const diffColor = (document.getElementById("diffColor") as HTMLInputElement)
      .value;
    const diffColorAlt = (
      document.getElementById("diffColorAlt") as HTMLInputElement
    ).value;
    const aaColor = (document.getElementById("aaColor") as HTMLInputElement)
      .value;
    const includeAA = (document.getElementById("includeAA") as HTMLInputElement)
      .checked;

    // Validate numeric inputs
    if (isNaN(threshold) || threshold < 0 || threshold > 1) {
      throw new Error("Threshold must be between 0 and 1");
    }
    if (isNaN(alpha) || alpha < 0 || alpha > 1) {
      throw new Error("Alpha must be between 0 and 1");
    }

    // Validate color inputs
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(diffColor))
      throw new Error("Invalid diff color format");
    if (!colorRegex.test(diffColorAlt))
      throw new Error("Invalid alt diff color format");
    if (!colorRegex.test(aaColor)) throw new Error("Invalid AA color format");

    return {
      threshold,
      alpha,
      diffColor: hex2rgb(diffColor),
      diffColorAlt: hex2rgb(diffColorAlt),
      aaColor: hex2rgb(aaColor),
      includeAA,
    };
  } catch (error) {
    return new Error("Error getting settings", { cause: error });
  }
};

const saveSettings = () => {
  const pixelmatchSettings = getPixelmatchSettingsFromForm();
  if (pixelmatchSettings instanceof Error) {
    showError(pixelmatchSettings);
    return;
  }
  hideError();

  const defaultAlgo = (document.getElementById("algos") as HTMLSelectElement)
    .value;

  const newOptions: Partial<Settings> = {
    pixelmatchSettings,
    defaultAlgo,
  };

  browser.storage.sync.set(newOptions).catch((r) => {
    throw new Error(`Settings could not be saved. Error: ${r}`);
  });

  // Show success feedback
  const button = document.getElementById("submit") as HTMLButtonElement;
  const originalText = button.textContent;
  button.textContent = "Saved!";
  button.style.backgroundColor = "var(--button-hover)";
  setTimeout(() => {
    button.textContent = originalText;
    button.style.backgroundColor = "";
  }, 2000);
};

const restoreSettings = async () => {
  const settings = await getSettings();

  if (settings.pixelmatchSettings) {
    const ps = settings.pixelmatchSettings;

    if (ps.threshold !== undefined)
      (document.getElementById("threshold") as HTMLInputElement).value =
        ps.threshold.toString();

    if (ps.alpha !== undefined)
      (document.getElementById("alpha") as HTMLInputElement).value =
        ps.alpha.toString();

    if (ps.diffColor)
      (
        document.getElementById("diffColor") as HTMLInputElement
      ).value = `#${ps.diffColor
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")}`;

    if (ps.diffColorAlt)
      (
        document.getElementById("diffColorAlt") as HTMLInputElement
      ).value = `#${ps.diffColorAlt
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")}`;

    if (ps.aaColor)
      (
        document.getElementById("aaColor") as HTMLInputElement
      ).value = `#${ps.aaColor
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")}`;

    if (ps.includeAA !== undefined)
      (document.getElementById("includeAA") as HTMLInputElement).checked =
        ps.includeAA;
  }

  algoNames.forEach((algoName) => {
    const optionName = capitalizeFirstLetter(algoName);
    const newOption = new Option(optionName, optionName);
    (document.getElementById("algos") as HTMLSelectElement).add(newOption);
  });

  if (settings.defaultAlgo)
    (document.getElementById("algos") as HTMLSelectElement).value =
      settings.defaultAlgo;
};

const resetToDefaults = () => {
  const { pixelmatchSettings } = defaultSettings;

  if (pixelmatchSettings.threshold !== undefined)
    (document.getElementById("threshold") as HTMLInputElement).value =
      pixelmatchSettings.threshold.toString();

  if (pixelmatchSettings.alpha !== undefined)
    (document.getElementById("alpha") as HTMLInputElement).value =
      pixelmatchSettings.alpha.toString();

  // Convert RGB array back to hex color
  if (pixelmatchSettings.diffColor) {
    const [r, g, b] = pixelmatchSettings.diffColor;
    (document.getElementById("diffColor") as HTMLInputElement).value = `#${r
      .toString(16)
      .padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
      .toString(16)
      .padStart(2, "0")}`;
  }

  if (pixelmatchSettings.diffColorAlt) {
    const [r, g, b] = pixelmatchSettings.diffColorAlt;
    (document.getElementById("diffColorAlt") as HTMLInputElement).value = `#${r
      .toString(16)
      .padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
      .toString(16)
      .padStart(2, "0")}`;
  }

  if (pixelmatchSettings.aaColor) {
    const [r, g, b] = pixelmatchSettings.aaColor;
    (document.getElementById("aaColor") as HTMLInputElement).value = `#${r
      .toString(16)
      .padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
      .toString(16)
      .padStart(2, "0")}`;
  }

  if (pixelmatchSettings.includeAA !== undefined)
    (document.getElementById("includeAA") as HTMLInputElement).checked =
      pixelmatchSettings.includeAA;

  // Reset algo selector
  (document.getElementById("algos") as HTMLSelectElement).value =
    defaultSettings.defaultAlgo;

  // Save the default settings
  saveSettings();
};

document.addEventListener("DOMContentLoaded", restoreSettings);
document.addEventListener("submit", (e) => {
  e.preventDefault();
  saveSettings();
});
document.getElementById("reset")?.addEventListener("click", resetToDefaults);
