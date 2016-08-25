const fs = require('fs');
const path = require('path');
const pug = require('pug');
const Renderer = require('marked').Renderer;
const yml = require('js-yaml');

/**
 * Options that can be passed to `Spacedoc.config()`.
 * @typedef {Object} ConfigOptions
 * @prop {Object.<String, Object>} [config={}] - Options to pass to adapters. Each key is an adapter name, such as `sass` or `js`, and each value is an object of settings.
 * @prop {Object} [data={}] - Extra data to pass to the template, which will be merged with the page's data.
 * @prop {String} [extension='html'] - Extension for use for output files.
 * @prop {Marked=} marked - Instance of [Marked](https://www.npmjs.com/package/marked) to use when converting Markdown to HTML.
 * @prop {Boolean} [silent=false] - Disable console output while processing pages.
 * @prop {?(Function|String)} [template=null] - Path to a Pug template to use when rendering, or a pre-compiled template function.
 * @prop {Object} [search={}] - Search-specific options.
 * @prop {SearchResult[]} [search.extra=[]] - Hardcoded items to add to a search result list when calling `Spacedoc.buildSearch()`.
 * @prop {String[]} [search.sort=[]] - Sorting criteria for search results. The `type` property of each result is used for comparison.
 * @prop {Object.<String, String>} [pageTypes={}] - Custom page types to reference when generating search results.
 */

/**
 * Set Spacedoc options. Call this before `Spacedoc.init()` is run.
 * This function does not set adatpers&mdash;use `Spacedoc.adapter()` to set adapters.
 * @param {ConfigOptions} [opts={}] - Plugin options.
 * @returns {Spacedoc} Spacedoc instance. This method can be chained to other Spacedoc methods.
 */
module.exports = function config(opts = {}) {
  this.options = Object.assign({
    config: {},
    data: {},
    extension: 'html',
    marked: new Renderer(),
    pageRoot: process.cwd(),
    silent: false,
    template: null
  }, opts);

  this.options.search = Object.assign({
    extra: [],
    sort: [],
    pageTypes: {}
  }, opts.search || {});

  // Load HTML template
  if (typeof opts.template === 'string') {
    try {
      this.template = pug.compileFile(opts.template);
    }
    catch (e) {
      throw new Error('Spacedoc: error loading template file: ' + e.message);
    }
  }
  else if (typeof this.options.template === 'function') {
    this.template = this.options.template;
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
