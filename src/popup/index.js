// Saves options to browser.storage
const saveOptions = () => {
  const color = document.getElementById("color").value;

  browser.storage.sync.set({ diffColor: color }).catch((r) => {
    throw new Error(`Color options could not be saved. Error: ${r}`);
  });
};

// Restores select box and checkbox state using the preferences
// stored in browser.storage.
const restoreOptions = () => {
  browser.storage.sync.get({ diffColor: "#AAFF00" }).then((items) => {
    document.getElementById("color").value = items.diffColor;
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("color").addEventListener("change", saveOptions, false);
