const path = require('path');
const pug = require('pug');

/**
 * Enable a built-in adapter, or define a custom one. The built-in adapters are `sass` and `js`. They can also be overwritten with a custom class.
 *
 * @example <caption>Enabling a built-in adapter:</caption>
 * Spacedoc.adapter('sass');
 *
 * @example <caption>Adding a custom adapter:</caption>
 * const RDocParser = require('./rdocparser');
 * Spacedoc.adapter('ruby', RDocParser);
 *
 * @param {String} name - Name of adapter.
 * @param {Class} func - Adapter class.
 * @throws Will throw an error if a non-existant built-in adapter is referenced.
 * @throws Will throw an error if the second parameter is not a function.
 */
module.exports = function(name) {
  let adapterPath = '';

  try {
    adapterPath = require.resolve(`spacedoc-${name}`)
  }
  catch (e) {
    try {
      adapterPath = require.resolve(path.join(process.cwd(), name));
    }

    catch (e) {
      return;
    }
  }

  const adapter = require(adapterPath);
  const template = path.join(path.dirname(adapterPath), 'template/index.pug');

  this.adapters[adapter.name()] = adapter;
  this.adapters[adapter.name()].template = pug.compileFile(template);

  return this;
}
