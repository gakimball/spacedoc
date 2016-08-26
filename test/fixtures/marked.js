var marked = require('marked');
var hljs   = require('highlight.js');

var mdRenderer = new marked.Renderer();

mdRenderer.heading = function(text, level) {
  var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

  return `<h${level} class="docs-heading"><a name="${escapedText}" class="docs-heading-icon" href="#${escapedText}"></a>${text}</h{0}>`;
}

mdRenderer.code = function(code, language) {
  var extraOutput = '';

  if (typeof language === 'undefined') language = 'html';

  // If the language is *_example, live code will print out along with the sample
  if (language.match(/_example$/)) {
    extraOutput = `\n\n${code}`;
    language = language.replace(/_example$/, '');
  }

  var renderedCode = hljs.highlight(language, code).value;
  var output = `<div class="docs-code" data-docs-code><pre><code class="${language}">${renderedCode}</code></pre></div>`;

  return output + extraOutput;
}

module.exports = mdRenderer;
