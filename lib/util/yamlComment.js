const strip = require('strip-indent');

/**
 * Extract Front Matter blocks from comments in a Pug or HTML file.
 * @param {String} input - Input Pug or HTML.
 * @param {String} extension - File extension, formatted like `.pug`.
 * @returns {String} Formatted string.
 *
 * @example
 * const input =
 * `<!--
 * title: Page Title
 * -->
 * <p>Lorem ipsum</p>
 * `;
 * yamlComment(input, '.html');
 */
module.exports = function yamlComment(input, extension) {
  if (extension === '.pug') {
    const rx = /^\/\/-\n([\s\S]+:[\s\S]+)\n\n/;
    const match = rx.exec(input);
    if (match) {
      return input.replace(match[0], `---\n${strip(match[1])}\n---\n\n`);
    }
  }
  else if (extension === '.html') {
    const rx = /^.*<!--\n([\s\S]+:[\s\S]+)\n-->/m;
    const match = rx.exec(input);
    if (match) {
      return input.replace(match[0], `---\n${match[1]}\n---`);
    }
  }

  return input;
}
