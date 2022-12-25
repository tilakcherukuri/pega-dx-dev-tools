# Requirement

- [x] 7z
- [x] VSCode

# Introduction

1. copy `manifest.json` from `platform/mv3` or `platform/mv2` to the root of the project
2. In case there is modifications done on manifest.json consider override the correspondant `manifest.json` in `platform/mv3` or `platform/mv2`
3. Load extension folder into chrome using Unpack mode
4. According to this [MDN doc](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/manifest_version) MV2 will offer cross-platform support, while MV3 is still in preview for most browsers.
