// Saves options to chrome.storage
const saveOptions = () => {
  const color = document.getElementById("color").value;

  chrome.storage.sync.set({ diffColor: color }, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById("status");
    status.textContent = "Options saved. Please refresh page.";
    setTimeout(() => {
      status.textContent = "";
    }, 1500);
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
