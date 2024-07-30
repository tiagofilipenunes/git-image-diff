chrome.runtime.connect();

// Saves options to chrome.storage
const saveOptions = () => {
  const color = document.getElementById("color").value;

  chrome.storage.sync.set({ diffColor: color }, () => {
    // Refresh page on success and throw error otherwise
    if (!!chrome.runtime.lastError)
      throw new Error(
        `Color options could not be saved. Error: ${chrome.runtime.lastError}`
      );
  });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get({ diffColor: "#AAFF00" }, (items) => {
    document.getElementById("color").value = items.diffColor;
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("color").addEventListener("change", saveOptions, false);
