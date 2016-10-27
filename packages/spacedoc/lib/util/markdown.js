const hljs = require('highlight.js');

/**
 * Default Markdown renderer.
 * @type MarkdownIt
 */
module.exports = require('markdown-it')({
  /**
   * Convert a Markdown code fence into an HTML code block.
   * If the language is `html_example`, a code block will be rendered along with a live sample of the HTML.
   * @param {String} code - Code within fence.
   * @param {String} lang - Language to highlight in.
   * @returns {String} HTML of highlighted code block.
   */
  highlight: (code, lang) => {
    // Rendering for HTML examples
    if (lang === 'html_example') {
      const { value } = hljs.highlight('html', code);
      return `<pre class="sd-codeblock"><code class="hljs ${lang}">${value}</code></pre><div class="sd-codesample">${code}</div>`;
    }
    // Rendering for everything else
    else {
      const { value } = (lang ? hljs.highlight(lang, code) : hljs.highlightAuto(code));
      return `<pre class="sd-codeblock"><code class="hljs ${lang}">${value}</code></pre>`;
    }
  },
});
