# Better GitHub image diff

The `Better Github Image Diff` Chromium/Firefox extension improves the image diff experience on GitHub `Files Changed` view.

## Features

Difference between the two images are shown in different ways:

- **Overlay** : shows the different pixels overlayed on the new image
- **Difference** : shows the different pixels in a new image

### Customization

The extension allows to customize the highlight color in the pop-up options.

## Development

To run the extension in development mode, run the following commands:

```zsh
npm run dev:chromium
```

```zsh
npm run dev:firefox
```

## Building

To build the extension, run the following commands:

```zsh
npm run build:chromium
```

```zsh
npm run build:firefox
```

## Running

To run the extension after building, run the following commands, for Google Chromium and Mozilla Firefox respectively:

```zsh
npm run start:chromium
```

```zsh
npm run start:firefox
```

## Installation

### Chromium

1. Clone the repository and install the dependencies using `npm i`
2. Run `npm run build:chromium` to build the extension
3. Open a Chromium-based browser and go to `chrome://extensions/`
4. Enable `Developer mode`
5. Click on `Load unpacked` and select the `dist` folder

### Firefox

1. Clone the repository and install the dependencies using `npm i`
2. Run `npm run build:firefox` to build the extension and `npm run pack:firefox` to prepare it for installation
3. Open Firefox and go to `about:debugging#/runtime/this-firefox`
4. Click on `Load Temporary Add-on...` and select the .zip package in the `web-ext-artifacts` folder

## License

[MIT license](LICENSE)
