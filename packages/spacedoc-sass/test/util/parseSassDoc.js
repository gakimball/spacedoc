const sassdoc = require('sassdoc');

/**
 * Parse a single Sass file with SassDoc and return that file's documentation data.
 * @param {String} file - Name of file in fixtures folder to parse.
 * @returns {Promise.<Object[]>} - Promise containing documentation items.
 */
module.exports = function parseSassDoc(file) {
  return sassdoc.parse(`test/fixtures/${file}.scss`).then(data => data[0]);
}
