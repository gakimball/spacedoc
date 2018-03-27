const getConfig = require('flexiconfig');
const getAdapter = require('./get-adapter');

/**
 * Set Spacedoc options. Call this before `Spacedoc.init()` is run.
 * @param {(ConfigOptions|String)} [opts={}] - Plugin options, or a path to a YML config file with options.
 * @returns {Spacedoc} Spacedoc instance. This method can be chained to other Spacedoc methods.
 */
module.exports = (opts = {}) => {
  // Config can either be an object or an external config file
  try {
    Object.assign(opts, getConfig([opts, 'spacedoc.yml']));
  }
  catch (e) {
    console.log('Spacedoc has not been configured.');
  }

  /**
   * Options that can be passed to `Spacedoc.config()`.
   * @typedef {Object} ConfigOptions
   * @prop {(String[]|Array[])} [adapters=[]] - Adapters to load.
   * @prop {String} input - Folder containing documentation pages.
   * @prop {(String|String[])} - Folder(s) containing documentable code.
   * @prop {Boolean} [silent=false] - Disable console output while processing pages.
   */
  const options = Object.assign({
    adapters: [],
    docs: null,
    pages: null,
  }, opts);

  return {
    adapters: new Map(options.adapters.map(name => {
      const adapter = getAdapter(name);
      return [adapter.name, adapter];
    })),
    docs: options.docs,
    pages: options.pages,
  };
};
