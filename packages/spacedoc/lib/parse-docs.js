/**
 * Format of adapter data returned by `Spacedoc.parseDocs()`.
 * @private
 * @typedef {Object} AdapterData
 * @prop {String} adapter - Adapter name.
 * @prop {Object[]} data - Adapter data.
 */

/**
 * Pulls documentation data from a set of adapters.
 * @param {Object.<String, *>} [adapters={}] - Adapter settings to use. Each key is an adapter, such as `sass` or `js`, and each value is a config value for that adapter.
 * @returns {Promise.<AdapterData[]>} Promise containing an array of adapter data objects.
 */
module.exports = function (adapters = {}) {
  // Array of asynchronous functions to run, one for each adapter
  const parsers = Object.keys(adapters).filter(lib => lib in this.adapters).map(lib => {
    const adapter = this.adapters[lib];

    // @todo Can adapter.parse() just be returned?
    return new Promise((resolve, reject) => {
      adapter.parse(adapters[lib], adapter.config)
        .then(data => resolve({adapter: lib, data}))
        .catch(e => reject(e));
    });
  });

  return Promise.all(parsers);
};
