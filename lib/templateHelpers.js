const hljs = require('highlight.js');
const marked = require('marked');

/**
 * Global helpers available to all templates and adapters.
 * @private
 * @constant
 */
module.exports = {
  title: title,
  highlight: highlight,
  markdown: markdown
}

/**
 * Capitalize the first letter of a string.
 * @param {String=} text - Text to capitalize.
 * @returns {String} Capitalized text.
 */
function title(text = '') {
  return text[0].toUpperCase() + text.slice(1);
}

/**
 * Highlight code with Highlight.js.
 * @param {String=} code - Code to highlight.
 * @returns {String} Highlighted code as HTML.
 */
function highlight(code = '') {
  return hljs.highlightAuto(code, ['html', 'css', 'sass', 'javascript']).value;
}

/**
 * Convert Markdown to HTML.
 * @param {String=} text - Markdown text.
 * @returns {String} Converted HTML.
 */
function markdown(text = '') {
  return marked(text);
}
