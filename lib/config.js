const isEmptyObject = require('is-empty-object');
const fs = require('fs');
const loadTemplates = require('./util/loadTemplates');
const path = require('path');
const pug = require('pug');
const Renderer = require('marked').Renderer;
const yml = require('js-yaml');

/**
 * Options that can be passed to `Spacedoc.config()`.
 * @typedef {Object} ConfigOptions
 * @prop {String[]} [adapters=[]] - Adapters to load.
 * @prop {Object.<String, Object>} [config={}] - Options to pass to adapters. Each key is an adapter name, such as `sass` or `js`, and each value is an object of settings.
 * @prop {Object} [data={}] - Extra data to pass to the template, which will be merged with the page's data.
 * @prop {String} [extension='html'] - Extension for use for output files.
 * @prop {Marked=} marked - Instance of [Marked](https://www.npmjs.com/package/marked) to use when converting Markdown to HTML.
 * @prop {Boolean} [silent=false] - Disable console output while processing pages.
 * @prop {?(Function|String)} [template=null] - Path to a Pug template to use when rendering, or a pre-compiled template function.
 * @prop {Object} [search={}] - Search-specific options.
 * @prop {String} [search.outFile=''] - Filename to write search JSON to.
 * @prop {SearchResult[]} [search.extra=[]] - Hardcoded items to add to a search result list when calling `Spacedoc.buildSearch()`.
 * @prop {String[]} [search.sort=[]] - Sorting criteria for search results. The `type` property of each result is used for comparison.
 * @prop {Object.<String, String>} [pageTypes={}] - Custom page types to reference when generating search results.
 */

/**
 * Set Spacedoc options. Call this before `Spacedoc.init()` is run.
 * @param {?(ConfigOptions|String)} [opts={}] - Plugin options, or a path to a YML config file with options.
 * @returns {Spacedoc} Spacedoc instance. This method can be chained to other Spacedoc methods.
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

  // Extend defaults
  this.options = Object.assign({
    adapters: [],
    config: {},
    data: {},
    extension: 'html',
    marked: new Renderer(),
    pageRoot: process.cwd(),
    silent: false,
    site: {},
    template: null
  }, opts);

  // Extend search defaults
  this.options.search = Object.assign({
    dest: null,
    extra: [],
    sort: [],
    pageTypes: {}
  }, opts.search || {});

  // Load adapters
  this.options.adapters.map(adapter => this.addAdapter(adapter));

  // Load HTML template
  // If the template option is a string, it could be a single Pug file or a directory of Pug files
  if (typeof opts.template === 'string') {
    // If a directory is passed in, look for a file inside called `default.pug`
    if (path.extname(opts.template) === '') {
      const templates = loadTemplates(opts.template);
      let templateVars;

      // A template directory must have a "default.pug"
      if (!('default' in templates)) {
        throw new Error(`Spacedoc: template folder ${opts.template} must have a file called "default.pug"`);
      }

      // Load template data defaults
      try {
        templateVars = require(opts.template);
      }
      catch (e) {
        templateVars = {};
      }

      this.templates = templates;
      this.options.site = Object.assign({}, templateVars, this.options.site);
      this.multiTemplate = true;
    }
    // If a single file is passed in, just compile that one
    else {
      try {
        this.templates.default = pug.compileFile(opts.template);
      }
      catch (e) {
        throw new Error(`Spacedoc: error loading template file: ${e.message}`);
      }
    }
  }
  // If the template option is a function, just load it as-is
  else if (typeof this.options.template === 'function') {
    this.templates.default = this.options.template;
  }
  // By default, load the built-in template directory
  else {
    this.options.template = path.join(__dirname, '../template');
    this.templates = loadTemplates(this.options.template);
    this.options.site = Object.assign({}, require(this.options.template), this.options.site);
    this.multiTemplate = true;
  }

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
