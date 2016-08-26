function Spacedoc() {
  this.options = {};
  this.adapters = {};
  this.tree = [];
  this.template = null;
}

Spacedoc.prototype.init = require('./lib/init');
Spacedoc.prototype.parse = require('./lib/parse');
Spacedoc.prototype.parseDocs = require('./lib/parseDocs');
Spacedoc.prototype.build = require('./lib/build');
Spacedoc.prototype.addAdapter = require('./lib/addAdapter');
Spacedoc.prototype.config = require('./lib/config');
Spacedoc.prototype.buildSearch = require('./lib/buildSearch');

const sd = new Spacedoc();

// Public API
module.exports = sd.init.bind(sd);
module.exports.config = sd.config.bind(sd);
module.exports.buildSearch = sd.buildSearch.bind(sd);
Object.defineProperty(module.exports, 'tree', {
  get: () => sd.tree
});

module.exports._instance = sd;

// Standalone class
module.exports.Spacedoc = Spacedoc;
