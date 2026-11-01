// JS-sequence-diagrams auto-renderer: renders the current document as a sequence diagram.
// Rendering library: https://bramp.github.io/js-sequence-diagrams/
// See README.md for usage instructions.

(function () {
  'use strict';

  // Pinned dependencies, loaded in order. js-sequence-diagrams expects all of these as globals.
  var DEPENDENCIES = [
    // Required by js-sequence-diagrams to measure custom fonts before drawing.
    'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js',
    // SVG drawing backend.
    'https://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js',
    // Used throughout js-sequence-diagrams (2.0.1 still relies on the `_` global).
    'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.8/underscore-min.js',
    // js-sequence-diagrams itself. cdnjs has no usable 2.0.1 assets and the npm package is a
    // security placeholder, so this loads the official GitHub tag through jsDelivr.
    'https://cdn.jsdelivr.net/gh/bramp/js-sequence-diagrams@2.0.1/dist/sequence-diagram-min.js'
  ];

  var THEME = 'simple';

  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = url;
      script.async = false;
      script.onload = function () { resolve(); };
      script.onerror = function () {
        reject(new Error('failed to load ' + url));
      };
      document.head.appendChild(script);
    });
  }

  function showError(error) {
    // Leave the diagram source on screen and append the failure instead of blanking the page.
    var message = document.createElement('pre');
    message.setAttribute('role', 'alert');
    message.style.color = '#b00020';
    message.style.whiteSpace = 'pre-wrap';
    message.textContent = 'js-sequence-diagrams-autorenderer: ' + error.message;
    document.body.appendChild(message);
    if (window.console && console.error) console.error(error);
  }

  function render() {
    var source = document.body.textContent;
    var diagram = Diagram.parse(source);
    var container = document.createElement('div');
    container.className = 'js-sequence-diagrams';
    document.body.textContent = '';
    document.body.appendChild(container);
    diagram.drawSVG(container, { theme: THEME });
  }

  function whenReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  whenReady(function () {
    DEPENDENCIES.reduce(function (chain, url) {
      return chain.then(function () { return loadScript(url); });
    }, Promise.resolve())
      .then(render)
      .catch(showError);
  });
})();
