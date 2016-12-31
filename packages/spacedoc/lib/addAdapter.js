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
  let adapter;

  try {
    adapter = require(`spacedoc-${name}`)
  }
  catch (e) {
    try {
      adapter = require(path.join(process.cwd(), name));
    }

    catch (e) {
      throw new Error(`Couldn\'t load an adapter named "${name}". Make sure you have a module called "spacedoc-${name}" installed.`);
    }
  }

  /**
   * Adapter definition.
   * @typedef {Object} AdapterDefinition
   * @prop {Function} parse - Parsing function. Extracts documentation data.
   * @prop {Object} config - Parser configuration. Combines adapter defaults with user-defined settings.
   */
  this.adapters[adapter.adapterName] = {
    parse: adapter,
    config: Object.assign(
      typeof adapter.config === 'function' ? adapter.config() : {},
      this.options.config[adapter.adapterName] || {}
    ),
  };

  return this;
}
