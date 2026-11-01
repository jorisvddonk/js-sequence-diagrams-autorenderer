# JS-sequence-diagrams auto-renderer

[![CI](https://github.com/jorisvddonk/js-sequence-diagrams-autorenderer/actions/workflows/ci.yml/badge.svg)](https://github.com/jorisvddonk/js-sequence-diagrams-autorenderer/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/js-sequence-diagrams-autorenderer.svg)](https://www.npmjs.com/package/js-sequence-diagrams-autorenderer)

Zero-config browser renderer for [js-sequence-diagrams](https://bramp.github.io/js-sequence-diagrams/) documents.
Drop one `<script>` tag into a plain-text diagram file, save it as `.html`, and the diagram renders itself when
opened in a browser. No build step, no bundler, no local dependencies.

## Usage

Write your diagram as usual, then append this line at the end of the file:

```html
# <script src="https://unpkg.com/js-sequence-diagrams-autorenderer@1.0.2/index.js"></script>
```

Save the file as `.html` and open it in a browser. The leading `#` makes the line a comment for
js-sequence-diagrams, so it is ignored while parsing even though the browser picks up the `<script>` tag.

See [`test.html`](https://github.com/jorisvddonk/js-sequence-diagrams-autorenderer/blob/main/test.html) for a complete example:

```text
Andrew->China: Says Hello
Note right of China: China thinks\nabout it
China-->Andrew: How are you?
Andrew->>China: I am good thanks!

# Rendered using JS-sequence-diagrams (https://bramp.github.io/js-sequence-diagrams/) by the line below:
# <script src="https://unpkg.com/js-sequence-diagrams-autorenderer@1.0.2/index.js"></script>
```

### Pinning versions

Always pin a version (`@1.0.2`). Using `@latest` means a future release can change the rendering without you
changing the document. The renderer is also served from jsDelivr if you prefer:

```html
# <script src="https://cdn.jsdelivr.net/npm/js-sequence-diagrams-autorenderer@1.0.2/index.js"></script>
```

## How it works

`index.js` loads its dependencies in order from public CDNs, parses `document.body.textContent` with
js-sequence-diagrams, clears the page and draws the result as SVG with the `simple` theme.

If a dependency fails to load or the diagram text cannot be parsed, the original source stays visible and an
error message is appended to the page (and logged to the console).

## Dependencies

All runtime dependencies are pinned and loaded from a CDN at page load time:

| Dependency | Version | Source |
| --- | --- | --- |
| [Web Font Loader](https://github.com/typekit/webfontloader) | 1.6.28 | cdnjs |
| [Raphaël](https://dmitrybaranovskiy.github.io/raphael/) | 2.3.0 | cdnjs |
| [Underscore.js](https://underscorejs.org/) | 1.13.8 | cdnjs |
| [js-sequence-diagrams](https://bramp.github.io/js-sequence-diagrams/) | 2.0.1 | jsDelivr (GitHub tag) |

js-sequence-diagrams is served from its official GitHub tag because the npm package is a security placeholder
and cdnjs has no usable 2.0.1 assets.

## Notes and limitations

- Requires an internet connection; the dependencies are not bundled.
- One diagram per document.
- The document must remain plain text (plus the `<script>` tag), not a full HTML page with a `<body>` of markup.
- All content in `document.body.textContent` is parsed, so use `#` for comment lines.

## Development

```bash
npm test
```

The test suite checks the npm metadata, verifies that `README.md`/`test.html` point at the current version,
ensures the CDN dependencies are pinned and current, and confirms every dependency URL resolves to the pinned
version.

To try a local build without publishing, copy `test.html`, point the script tag at the local `index.js`
(`<script src="index.js"></script>`) and open the copy in a browser.

## Publishing

```bash
npm test        # must pass
npm publish     # publishes the version in package.json
git push --follow-tags
```

For future releases, bump the version (and update the usage snippets in `README.md` and `test.html`) with
`npm version patch|minor|major` before publishing. The test suite fails if the documentation points at a
stale version. See [CHANGELOG.md](https://github.com/jorisvddonk/js-sequence-diagrams-autorenderer/blob/main/CHANGELOG.md)
for release notes.

## License

MIT. See [LICENSE](./LICENSE).
