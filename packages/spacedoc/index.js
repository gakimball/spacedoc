const globWatcher = require('glob-watcher');

/**
 * Spacedoc parsing and building class.
 */
class Spacedoc {
  /**
   * Create a new Spacedoc parser.
   */
  constructor() {
    /**
     * Spacedoc instance settings.
     * @type ConfigOptions
     */
    this.options = {};

    /**
     * Adapters to use to parse documentation data.
     * @type Object.<Function>
     */
    this.adapters = {};

    /**
     * List of parsed pages.
     * @type PageData[]
     */
    this.tree = [];
  }
}

// Assign Spacedoc class methods
['addAdapter', 'build', 'buildSearch', 'config', 'init', 'parse', 'parseDocs'].map(fn => {
  Object.assign(Spacedoc.prototype, {
    [fn]: require(`./lib/${fn}`),
  });
});

/**
 * Exported Spacedoc instance.
 * @private
 * @type Spacedoc
 */
const sd = new Spacedoc();

/**
 * Run the Spacedoc parser and build pages.
 * @param {Object} [options] - Build options.
 * @param {Boolean} [options.watch = false] - Watch pages for changes and re-compile.
 * @returns {(Promise|Function)} If the `input` option was set in `Spacedoc.config()`, a Promise will be returned. Otherwise, a stream transform function will be returned.
 */
module.exports = ({ watch = false }) => {
  if (watch && sd.options.input) {
    globWatcher(sd.options.input, done => {
      sd.init().then(done);
    });
  }

  return sd.init();
};

/**
 * Configure Spacedoc.
 * @param {(ConfigOptions|String)} [opts={}] - Plugin options, or a path to a YML config file with options.
 */
module.exports.config = sd.config.bind(sd);

/**
 * Build static assets for a Spacedoc site, including CSS and JavaScript.
 * @param {Object} [options] - Build options.
 * @param {Boolean} [options.watch=false] - Watch files for changes and re-build assets.
 * @returns {Promise} Promise which resolves when the build process finishes, or rejects when there's an error. If the `watch` option is enabled, the Promise will not resolve.
 */
module.exports.build = ({ watch = false }) => {
  if (watch) {
    return sd.theme.buildAndWatch();
  }
  else {
    return sd.theme.build();
  }
}

/**
 * Generate a search file from the pages and doclets in the site.
 * @param {string} outFile - Path to write to.
 * @returns {Promise} Promise which resolves when the search file has been written to disk.
 */
module.exports.buildSearch = sd.buildSearch.bind(sd);

/**
 * List of pages that have been processed.
 * @type PageData[]
 */
Object.defineProperty(module.exports, 'tree', {
  get: () => sd.tree
});

// Direct reference to instance (mostly for debugging)
module.exports._instance = sd;

// Standalone class
module.exports.Spacedoc = Spacedoc;
