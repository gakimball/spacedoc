const parseSassDoc = require('./parseSassDoc');
const pug = require('pug');
const sassHelpers = require('../../helpers');
const spacedocHelpers = require('spacedoc-helpers');
const stripIndent = require('strip-indent')

/**
 * Parse a test fixture Sass file and run it through a Jade template.
 */
module.exports = function parseAndRender(fixture, template) {
  const helpers = Object.assign({}, spacedocHelpers, sassHelpers);
  return parseSassDoc(fixture).then(item =>
    pug.render(stripIndent(template), {
      filename: 'template/_test.pug',
      helpers: helpers,
      item: item,
    }));
}
