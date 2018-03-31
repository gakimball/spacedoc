const globWatcher = require('glob-watcher');

/**
 * Spacedoc parsing and building class.
 * @private
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
     * @type Object.<String, AdapterDefinition>
     */
    this.adapters = {};

    /**
     * List of parsed pages.
     * @type PageData[]
     */
    this.tree = [];

    /**
     * Theme class instance. Used to render pages.
     * @type ?Theme
     */
    this.theme = null;
  }
}

Spacedoc.prototype.addAdapter = require('./lib/add-adapter');
Spacedoc.prototype.build = require('./lib/build');
Spacedoc.prototype.buildSearch = require('./lib/build-search');
Spacedoc.prototype.config = require('./lib/config');
Spacedoc.prototype.init = require('./lib/init');
Spacedoc.prototype.parse = require('./lib/parse');
Spacedoc.prototype.parseDocs = require('./lib/parse-docs');

/**
 * Exported Spacedoc instance.
 * @private
 * @type Spacedoc
 */
const sd = new Spacedoc();

/**
 * Run the Spacedoc parser and build pages.
 * @name Spacedoc
 * @param {Object} [options] - Build options.
 * @param {Boolean} [options.watch = false] - Watch pages for changes and re-compile.
 * @param {Function} cb - If watching, callback to run whenever files change.
 * @returns {(Promise|Function)} If the `input` option was set in `Spacedoc.config()`, a Promise will be returned. Otherwise, a stream transform function will be returned.
 */
module.exports = ({watch = false}, cb = () => {}) => {
  if (watch && sd.options.input) {
    globWatcher(sd.options.input, {ignoreInitial: false}, () => {
      return sd.init().then(() => {
        cb(null);
      }).catch(err => {
        cb(err);
      });
    });
  } else {
    return sd.init();
  }
};

/**
 * Configure Spacedoc.
 * @name Spacedoc.config
 * @param {(ConfigOptions|String)} [opts={}] - Plugin options, or a path to a YML config file with options.
 */
module.exports.config = sd.config.bind(sd);

/**
 * Build static assets for a Spacedoc site, including CSS and JavaScript.
 * @name Spacedoc.build
 * @param {Object} [options] - Build options.
 * @param {Boolean} [options.watch=false] - Watch files for changes and re-build assets.
 * @returns {Promise} Promise which resolves when the build process finishes, or rejects when there's an error. If the `watch` option is enabled, the Promise will not resolve.
 */
module.exports.build = ({watch = false}) => {
  if (watch) {
    return sd.theme.buildAndWatch();
  }

  return sd.theme.build();
};

/**
 * Generate a search file from the pages and doclets in the site.
 * @name Spacedoc.buildSearch
 * @param {string} outFile - Path to write to.
 * @returns {Promise} Promise which resolves when the search file has been written to disk.
 */
module.exports.buildSearch = sd.buildSearch.bind(sd);

/**
 * List of pages that have been processed.
 * @name Spacedoc.tree
 * @type PageData[]
 */
Object.defineProperty(module.exports, 'tree', {
  get: () => sd.tree
});

// Direct reference to instance (mostly for debugging)
module.exports._instance = sd;

// Standalone class
module.exports.Spacedoc = Spacedoc;
