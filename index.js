
// JS-sequence-diagrams auto-renderer; renders a document using JS-sequence-diagrams (https://bramp.github.io/js-sequence-diagrams/)
// See readme.md for usage instructions
// Pretty inefficient, but it works:
const a = document.createElement('script'); a.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js');
document.head.appendChild(a);
a.onload = () => {
  const b = document.createElement('script'); b.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js');
  document.head.appendChild(b);
  b.onload = () => {
    const c = document.createElement('script'); c.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js');
    document.head.appendChild(c);
    c.onload = () => {
      const d = document.createElement('script'); d.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/js-sequence-diagrams/1.0.6/sequence-diagram-min.js');
      document.head.appendChild(d);
      d.onload = () => {
        const diagram = Diagram.parse(document.body.textContent);
        document.body.textContent = "";
        const x = document.createElement('div');
        document.body.appendChild(x);
        diagram.drawSVG(x, {theme: 'simple'});
      }
    }
  }
}