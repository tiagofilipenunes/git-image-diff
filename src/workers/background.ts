import { RequestMessage } from "../logic";

// Chrome does not work well with async listener callbacks
browser.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const requestMessage = request as RequestMessage;
  if (requestMessage.action === "loadImage") {
    fetch(requestMessage.src)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        // Chrome does not allow Blobs to be passed from service workers
        return new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      })
      .then((result) => {
        if (result === null) throw Error("Could not load image");
        sendResponse({ success: true, response: result });
      })
      .catch((error) => {
        sendResponse({ success: false, response: error });
      });
    return true; // sets as async
  }
});
