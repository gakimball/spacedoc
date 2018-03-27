const path = require('path');

/**
 * An an adapter by attempting to `require()` it. The function first checks for an installed module, then tries to run `require()` relative to the current working directory.
 *
 * @example <caption>Enabling an installed adapter:</caption>
 * Spacedoc.addAdapter('sass');
 *
 * @example <caption>Enabling an adapter in a folder:</caption>
 * Spacedoc.addAdapter('./lib/rdoc');
 *
 * @example <caption>Adding configuration:</caption>
 * Spacedoc.addAdapter(['sass', { verbose: true }]);
 *
 * @param {(String|Array)} name - Name of, or path to module. Can also be an array with the name/path and a config object.
 * @returns {Object} Adapter with configuration.
 */
module.exports = name => {
  let config = {};
  let adapter;

  if (Array.isArray(name)) {
    [name, config] = name;
  }

  try {
    adapter = require(`spacedoc-${name}`);
  }
  catch (err1) {
    try {
      adapter = require(path.join(process.cwd(), name));
    }

    catch (err2) {
      throw new Error(`Couldn\'t load an adapter named "${name}". Make sure you have a module called "spacedoc-${name}" installed.`);
    }
  }

  /**
   * Adapter definition.
   * @typedef {Object} AdapterDefinition
   * @prop {Function} parse - Parsing function. Extracts documentation data.
   * @prop {Object} config - Parser configuration. Combines adapter defaults with user-defined settings.
   */
  return Object.assign({}, adapter, {
    config: Object.assign(
      typeof adapter.config === 'function' ? adapter.config() : {},
      config
    ),
  });
};
