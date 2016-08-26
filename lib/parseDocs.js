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
module.exports = function parseDocs(adapters = {}) {
  // Array of asynchronous functions to run, one for each adapter
  const parsers = Object.keys(adapters).filter(lib => lib in this.adapters).map(lib => {
    // Then find the configuration for the adapter and run it
    const Adapter = this.adapters[lib];
    const config = Object.assign({},
      typeof Adapter.config === 'function' ? Adapter.config() : {},
      this.options.config[lib] || {}
    );

    return new Promise((resolve, reject) => {
      parseDataFromAdapter(Adapter, adapters[lib], config)
        .then(data => resolve({ adapter: lib, data: data }))
        .catch(e => reject(e));
    });
  });

  return Promise.all(parsers);
}

/**
 * Given an adapter class and the raw data from that adapter, filter and group the items.
 * @private
 * @param {Class} adapter - Adapter class.
 * @param {Object[]} items - Items to process.
 * @returns {Object.<String, Object>} Sorted and filtered documentation data.
 */
function parseDataFromAdapter(Adapter, value, config) {
  return Adapter.parse(value, config).then(items => {
    let output = {};

    items.map(item => {
      if (!Adapter.filter(item)) {
        const group = Adapter.group(item);
        if (!output[group]) output[group] = [];
        output[group].push(item);
      }
    });

    return output;
  });
}
