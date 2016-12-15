/**
 * Spacedoc class.
 * @class
 * @todo Convert to an actual class.
 */
function Spacedoc() {
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

  /**
   * List of layouts pages can reference. Provided by the loaded template.
   * @type Object.<Function>
   */
  this.templates = {};

  /**
   * Indicates that the loaded template has multiple layouts.
   * @type Boolean
   */
  this.mutliTemplate = false;
}

// Spacedoc class methods
Spacedoc.prototype.init = require('./lib/init');
Spacedoc.prototype.parse = require('./lib/parse');
Spacedoc.prototype.parseDocs = require('./lib/parseDocs');
Spacedoc.prototype.build = require('./lib/build');
Spacedoc.prototype.addAdapter = require('./lib/addAdapter');
Spacedoc.prototype.config = require('./lib/config');
Spacedoc.prototype.buildSearch = require('./lib/buildSearch');

/**
 * Exported Spacedoc instance.
 * @constant
 * @type Spacedoc
 */
const sd = new Spacedoc();

// Public API
module.exports = sd.init.bind(sd);
module.exports.config = sd.config.bind(sd);
module.exports.buildSearch = sd.buildSearch.bind(sd);
Object.defineProperty(module.exports, 'tree', {
  get: () => sd.tree
});

// Direct reference to instance (mostly for debugging)
module.exports._instance = sd;

// Standalone class
module.exports.Spacedoc = Spacedoc;
