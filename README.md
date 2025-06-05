<div align="center">

# Better GitHub Image Diff

🖼️ Enhanced image comparison for GitHub's Pull Request reviews

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/gceenhdnmfioemgpkjaknhjofmojfeli)](https://chrome.google.com/webstore/detail/gceenhdnmfioemgpkjaknhjofmojfeli)
[![Firefox Add-ons](https://img.shields.io/amo/v/better-github-image-diff)](https://addons.mozilla.org/firefox/addon/better-github-image-diff)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Improve your GitHub Pull Request review experience with powerful image comparison tools.
Compare images with precision using overlay and difference views, perfect for visual regression testing.

[Installation](#installation) •
[Features](#features) •
[Development](#development)
[Building](#development)
[Running](#development)

</div>

## Features

Difference between the two images are shown in different ways:

- **Overlay** : shows the different pixels overlayed on the new image
- **Difference** : shows the different pixels in a new image

### Customization

The extension allows to customize the available pixelmatch settings, and the default difference algorithm to show on page load.

## Installation

Install the required packages by running:

```zsh
pnpm i
```

## Development

To run the extension in development mode, run the following commands:

```zsh
pnpm dev:chromium
```

```zsh
pnpm dev:firefox
```

## Building

To build the extension, run the following commands:

```zsh
pnpm build:chromium
```

```zsh
pnpm build:firefox
```

## Running

To run the extension after building, run the following commands, for Google Chromium and Mozilla Firefox respectively:

```zsh
pnpm start:chromium
pnpm dev:chromium # with hot reload
```

```zsh
pnpm start:firefox
pnpm dev:firefox # with hot reload
```

## E2E

E2E tests run in CI, but you can locally run them with:

```zsh
pnpm e2e
```

## Packing

If you wish to pack the extension to manually load it on a browser, you can run, for Google Chromium and Mozilla Firefox, respectively:

```zsh
pnpm pack:chromium
```

```zsh
pnpm pack:firefox
```

## Installation

### Chromium

1. Clone the repository and install the dependencies using `pnpm i`
2. Run `pnpm build:chromium` to build the extension
3. Open a Chromium-based browser and go to `chrome://extensions/`
4. Enable `Developer mode`
5. Click on `Load unpacked` and select the `dist` folder

### Firefox

1. Clone the repository and install the dependencies using `pnpm i`
2. Run `pnpm build:firefox` to build the extension and `pnpm pack:firefox` to prepare it for installation
3. Open Firefox and go to `about:debugging#/runtime/this-firefox`
4. Click on `Load Temporary Add-on...` and select the .zip package in the `web-ext-artifacts` folder
