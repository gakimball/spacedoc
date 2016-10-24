const groupBy = require('lodash.groupby');
const hljs = require('highlight.js');
const marked = require('marked');

/**
 * Global helpers available to all templates and adapters.
 * @private
 * @constant
 */
module.exports = {
  highlight,
  markdown,
  title,
  groupPages,
};

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
function markdown(text = '', inline = false) {
  const output = marked(text);

  if (inline) {
    return output.replace(/^<p>/, '').replace(/<\/p>$/, '');
  }
  return output;
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
 * Given an unsorted list of pages, group them by...group.
 * @param {Object[]} pages - Pages to group.
 * @returns {PageGroup[]} Grouped pages.
 */
function groupPages(pages = []) {
  const groups = groupBy(pages, ({ group }) => group === null ? '$default' : group);

  /**
   * Group definition with name and pages.
   * @typedef {Object} PageGroup
   * @prop {String} name - Name of group.
   * @prop {Object[]} pages - Pages within group.
   */
  return Object.keys(groups).sort().map(key => ({ name: key, pages: groups[key] }));
}
