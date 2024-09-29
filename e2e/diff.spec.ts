import { test, expect } from "./fixtures";

test("Goto github PR files changed and check diff", async ({ page }) => {
  await page.goto(
    "https://github.com/bancorprotocol/carbon-app/pull/1464/files"
  );
  const firstIframe = page.frameLocator("iframe").first();
  const iframeBody = firstIframe.locator("body");

  await expect(iframeBody).toContainText("Difference");
  await expect(iframeBody).toContainText("Overlay");
});

test("Check settings page contains right header and labels", async ({
  page,
  extensionId,
}) => {
  await page.goto(`chrome-extension://${extensionId}/src/popup/index.html`);
  await expect(page.locator("h1")).toContainText("Settings");
  expect(page.locator("form > label")).toHaveText([
    "Diff Color",
    "Default Algo",
  ]);
});
