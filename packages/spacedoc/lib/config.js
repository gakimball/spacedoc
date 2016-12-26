const isEmptyObject = require('is-empty-object');
const fs = require('fs');
const globParent = require('glob-parent');
const markdown = require('./util/markdown');
const path = require('path');
const pug = require('pug');
const Theme = require('portatheme');
const yml = require('js-yaml');

/**
 * Set Spacedoc options. Call this before `Spacedoc.init()` is run.
 * @param {?(ConfigOptions|String)} [opts={}] - Plugin options, or a path to a YML config file with options.
 * @returns {Spacedoc} Spacedoc instance. This method can be chained to other Spacedoc methods.
 * @todo Combine options.config into options.adapters
 * @todo Allow *.js config files to be loaded (change needed in flexiconfig)
 */
module.exports = function config(opts = {}) {
  // Load config from a file
  if (typeof opts === 'string') {
    try {
      opts = yml.safeLoad(fs.readFileSync(opts).toString());
    }
    catch (e) {
      console.log(e);
      console.warn(`Spacedoc: could not open config file ${opts}`);
    }
  }

  // Try to load config in current directory
  else if (isEmptyObject(opts)) {
    try {
      opts = yml.safeLoad(fs.readFileSync(path.join(process.cwd(), 'spacedoc.yml')).toString());
    }
    catch (e) {}
  }

  /**
   * Options that can be passed to `Spacedoc.config()`.
   * @typedef {Object} ConfigOptions
   * @prop {String[]} [adapters=[]] - Adapters to load.
   * @prop {Object.<String, Object>} [config={}] - Options to pass to adapters. Each key is an adapter name, such as `sass` or `js`, and each value is an object of settings.
   * @prop {Object} [data={}] - Extra data to pass to the template, which will be merged with the page's data.
   * @prop {String} [extension='html'] - Extension for use for output files.
   * @prop {Marked=} [markdown] - Instance of [markdown-it](https://www.npmjs.com/package/markdown-it) to use when converting Markdown to HTML.
   * @prop {?String} [pageRoot] - Root directory for pages.
   * @prop {Object} [search={}] - Search-specific options.
   * @prop {String} [search.outFile=''] - Filename to write search JSON to.
   * @prop {SearchResult[]} [search.extra=[]] - Hardcoded items to add to a search result list when calling `Spacedoc.buildSearch()`.
   * @prop {String[]} [search.sort=[]] - Sorting criteria for search results. The `type` property of each result is used for comparison.
   * @prop {Object.<String, String>} [search.pageTypes={}] - Custom page types to reference when generating search results.
   * @prop {Boolean} [silent=false] - Disable console output while processing pages.
   * @prop {Object} [site={}] - Theme globals.
   * @prop {?(Function|String)} [theme] - Custom theme to use.
   */
  this.options = Object.assign({
    adapters: [],
    config: {},
    data: {},
    extension: 'html',
    markdown: markdown,
    pageRoot: null,
    silent: false,
    site: {},
    theme: path.join(__dirname, '../theme')
  }, opts);

  // Extend search defaults
  this.options.search = Object.assign({
    output: opts.output ? path.join(opts.output, 'assets/search.json') : null,
    extra: [],
    sort: [],
    pageTypes: {}
  }, opts.search || {});

  // Try to infer the root directory of pages
  if (!this.options.pageRoot && this.options.input) {
    this.options.pageRoot = globParent(this.options.input);
  }
  else {
    this.options.pageRoot = process.cwd();
  }

  // Load adapters
  this.options.adapters.map(adapter => this.addAdapter(adapter));

  // Load theme
  this.theme = new Theme(this.options.theme);
  if (this.options.output) {
    this.theme.outputTo(this.options.output);
  }

  // Get theme globals
  try {
    this.options.site = Object.assign(
      {},
      require(path.join(this.theme.location, 'settings.js')),
      this.options.site
    );
  }
  catch (e) {}

  // Load extra results from an external file
  if (opts.search && typeof opts.search.extra === 'string') {
    const fileContents = fs.readFileSync(opts.search.extra);
    switch (path.extname(opts.search.extra)) {
      case '.json':
        this.options.search.extra = JSON.parse(fileContents);
        break;
      case '.yml':
        this.options.search.extra = yml.safeLoad(fileContents);
        break;
    }
  }
  else {
    this.options.search.extra = [];
  }

  return this;
}
