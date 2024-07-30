chrome.runtime.onConnect.addListener((port) => {
  // pop-up onDisconnect
  port.onDisconnect.addListener(() => {
    chrome.tabs.reload();
  });
});
