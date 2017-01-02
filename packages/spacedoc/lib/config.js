const fs = require('fs');
const getConfig = require('flexiconfig');
const globParent = require('glob-parent');
const markdown = require('./util/markdown');
const path = require('path');
const pug = require('pug');
const Theme = require('portatheme');
const yml = require('js-yaml');

/**
 * Set Spacedoc options. Call this before `Spacedoc.init()` is run.
 * @param {(ConfigOptions|String)} [opts={}] - Plugin options, or a path to a YML config file with options.
 * @returns {Spacedoc} Spacedoc instance. This method can be chained to other Spacedoc methods.
 */
module.exports = function config(opts = {}) {
  // Find config. `opts` can be an object or a string to a file path. If `opts` wasn't passed, a file called `spacedoc.yml` is searched for. Failing that, all the defauls are used
  try {
    opts = getConfig([opts, 'spacedoc.yml']);
  }
  catch (e) {
    console.log('Spacedoc has not been configured.');
  }

  /**
   * Options that can be passed to `Spacedoc.config()`.
   * @typedef {Object} ConfigOptions
   * @prop {(String|Array)[]} [adapters=[]] - Adapters to load.
   * @prop {Marked} [markdown] - Instance of [markdown-it](https://www.npmjs.com/package/markdown-it) to use when converting Markdown to HTML.
   * @prop {?String} [pageRoot] - Root directory for pages.
   * @prop {Object} [search={}] - Search-specific options.
   * @prop {String} [search.outFile=''] - Filename to write search JSON to.
   * @prop {SearchResult[]} [search.extra=[]] - Hardcoded items to add to a search result list when calling `Spacedoc.buildSearch()`.
   * @prop {String[]} [search.sort=[]] - Sorting criteria for search results. The `type` property of each result is used for comparison.
   * @prop {Object.<String, String>} [search.pageTypes={}] - Custom page types to reference when generating search results.
   * @prop {Boolean} [silent=false] - Disable console output while processing pages.
   * @prop {(String|String[])} [theme] - Custom theme to use.
   * @prop {Object} [themeOptions={}] - Theme global variables.
   */
  this.options = Object.assign({
    adapters: [],
    markdown: markdown,
    pageRoot: getDefaultPageRoot(),
    silent: false,
    theme: 'spacedoc-theme-default',
    themeOptions: {},
  }, opts);

  // Extend search defaults
  this.options.search = Object.assign({
    output: opts.output ? path.join(opts.output, 'assets/search.json') : null,
    extra: [],
    sort: [],
    pageTypes: {}
  }, opts.search || {});

  // Load adapters
  this.options.adapters.map(adapter => this.addAdapter(adapter));

  // Load theme
  this.theme = createTheme(this);

  if (this.options.output) {
    this.theme.outputTo(this.options.output);
  }

  // Get theme globals
  this.options.themeOptions = getThemeOptions(this);

  // Load extra results from an external file
  this.options.search.extra = getExtraSearchOpts();

  return this;

  /**
   * Get the default value of `options.pageRoot`.
   *   - If `opts.input` was set, the root can be inferred from the glob pattern.
   *   - Otherwise, the CWD is used.
   * @returns {String} Default page root.
   */
  function getDefaultPageRoot() {
    if (opts.input) {
      return globParent(opts.input);
    }
    else {
      return process.cwd();
    }
  }

  /**
   * Create the theme used by the renderer.
   *   - If `opts.theme` is a string, load the theme as-is.
   *   - If `opts.theme` is an array, compose a theme using the first value as the base theme, and subsequent values as inherited themes.
   * @param {Spacedoc} inst - Spacedoc instance.
   * @returns {Theme} Theme instance.
   */
  function createTheme(inst) {
    if (Array.isArray(inst.options.theme)) {
      const paths = Array.from(inst.options.theme).reverse();
      return paths.reduce((theme, path) => new Theme(path, theme), undefined);
    }
    else {
      return new Theme(inst.options.theme);
    }
  }

  /**
   * Get theme options. A theme can define variables that are passed to the Pug template when a page is rendered. These variables can be overridden by the user when configuring Spacedoc.
   * @param {Spacedoc} inst - Spacedoc instance.
   * @returns {Object} Theme options.
   */
  function getThemeOptions(inst) {
    try {
      return Object.assign(
        {},
        require(path.join(inst.theme.location, 'settings.js')),
        inst.options.themeOptions
      );
    }
    catch(e) {
      return inst.options.themeOptions;
    }
  }

  /**
   * Get extra search results from an external file. It can be formatted as JSON or YML. If `opts.search.extra` was not set, the value returned will be an empty array.
   * @returns {SearchResult[]} List of search results.
   */
  function getExtraSearchOpts() {
    if (opts.search && typeof opts.search.extra === 'string') {
      const fileContents = fs.readFileSync(opts.search.extra);

      switch (path.extname(opts.search.extra)) {
        case '.json':
          return JSON.parse(fileContents);
          break;
        case '.yml':
          return yml.safeLoad(fileContents);
          break;
      }
    }
    else {
      return [];
    }
  }
}
