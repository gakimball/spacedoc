const path = require('path');
const pug = require('pug');

/**
 * An an adapter by attempting to `require()` it. The function first checks for an installed module, then tries to run `require()` relative to the current working directory.
 *
 * @example <caption>Enabling an installed adapter:</caption>
 * Spacedoc.addAdapter('sass');
 *
 * @example <caption>Enabling an adapter in a folder:</caption>
 * Spacedoc.addAdapter('./lib/rdoc');
 *
 * @param {String} name - Name of, or path to module.
 */
module.exports = function addAdapter(name) {
  let adapterPath = '';

  try {
    adapterPath = require.resolve(`spacedoc-${name}`)
  }
  catch (e) {
    try {
      adapterPath = require.resolve(path.join(process.cwd(), name));
    }

    catch (e) {
      throw new Error(`Couldn\'t load an adapter named "${name}". Make sure you have a module called "spacedoc-${name}" installed.`);
    }
  }

  const adapter = require(adapterPath);
  this.adapters[adapter.adapterName] = adapter;

  return this;
}
