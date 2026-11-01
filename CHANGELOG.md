# Changelog

## 1.0.2

- Updated js-sequence-diagrams from 1.0.6 to 2.0.1 (loaded from the official GitHub tag via jsDelivr,
  because the npm package is a security placeholder and cdnjs has no usable 2.0.1 assets).
- Updated Underscore.js from 1.5.2 to 1.13.8.
- Confirmed Web Font Loader 1.6.28 and Raphaël 2.3.0 are the latest available versions.
- Rewrote the loader to load dependencies in a promise chain, wait for `DOMContentLoaded` when needed and
  report load/parse errors on the page instead of failing silently.
- Added an npm test suite covering package metadata, dependency pins, documentation versions and CDN reachability.
- Added `LICENSE`, GitHub Actions CI, `repository`/`homepage`/`bugs`/`keywords` metadata and a `files` allowlist
  so only `index.js` is published.
- Documented dependencies, limitations and the release process in the README.

## 1.0.1

- README updates.

## 1.0.0

- Initial release.
