import { RequestMessage } from "../logic";

browser.runtime.onConnect.addListener((port) => {
  // pop-up onDisconnect
  port.onDisconnect.addListener(() => {
    browser.tabs.reload();
  });
  return true;
});

browser.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if ((request as RequestMessage).action === "loadImage") {
    fetch((request as RequestMessage).src)
      .then((response) => response.blob())
      .then(sendResponse);
  }
  return true; // mark as async
});
