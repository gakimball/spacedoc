const hljs = require('highlight.js');
const markdownIt = require('markdown-it');
const randomId = require('random-id');
const stripIndent = require('strip-indent');

/**
 * Default Markdown renderer.
 * @type MarkdownIt
 */
const markdown = markdownIt({
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
    // Rendering multiple examples
    else if (lang === 'multi') {
      const codeBlocks = [];
      const id = randomId(6);
      let tabs = '';
      let tabContent = '';

      markdownIt({
        highlight: (code, lang) => {
          codeBlocks.push({ code, lang, });
          return '';
        }
      }).render(stripIndent(code));

      codeBlocks.map(({ code, lang }, index) => {
        const { value } = (lang ? hljs.highlight(lang, code) : hljs.highlightAuto(code));

        tabs += `<li class="tabs-title${index > 0 ? '' : ' is-active'}"><a href="#${id+index}"${index > 0 ? '' : 'aria-selected="true"'}>${lang}</a></li>`;
        tabContent += `<div class="tabs-panel${index > 0 ? '': ' is-active'}" id="${id+index}"><pre class="sd-codeblock"><code class="hljs ${lang}">${value}</code></pre></div>`;
      }).join('\n');

      return `<pre class="sd-multisample"><ul class="tabs" data-tabs id="${id}">${tabs}</ul><div class="tabs-content" data-tabs-content="${id}">${tabContent}</div></pre>`;
    }
    // Rendering for everything else
    else {
      const { value } = (lang ? hljs.highlight(lang, code) : hljs.highlightAuto(code));
      return `<pre class="sd-codeblock"><code class="hljs ${lang}">${value}</code></pre>`;
    }
  },
});

module.exports = markdown;
