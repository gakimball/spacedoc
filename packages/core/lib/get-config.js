const getConfig = require('flexiconfig');
const getAdapter = require('./get-adapter');

/**
 * Generate Spacedoc options. If a non-empty object is passed to the function, it will be added
 * to the default config. Otherwise, a `spacedoc.yml` will be loaded, if it exists.
 * @param {SpacedocParserOptions} [opts={}] - Spacedoc options.
 * @returns {SpacedocParserOptions} Spacedoc options with defaults added.
 */
module.exports = (opts = {}) => {
  // Config can either be an object or an external config file
  try {
    Object.assign(opts, getConfig([opts, 'spacedoc.yml']));
  } catch (e) {
    console.log('Spacedoc has not been configured.');
  }

  /**
   * Options that can be passed to `Spacedoc.config()`.
   * @typedef {Object} SpacedocParserOptions
   * @prop {(String[]|Array[])} adapters - Adapters to load.
   * @prop {String} input - Folder containing documentation pages.
   * @prop {(String|String[])} docs - Folder(s) containing documentable code.
   */
  const options = Object.assign({
    adapters: [],
    docs: null,
    pages: null
  }, opts);

  return {
    adapters: new Map(options.adapters.map(name => {
      const adapter = getAdapter(name);
      return [adapter.name, adapter];
    })),
    docs: options.docs,
    pages: options.pages
  };
};
