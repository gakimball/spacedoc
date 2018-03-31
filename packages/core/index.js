const path = require('path');
const globby = require('globby');
const flatten = require('flatten');
const getConfig = require('./lib/get-config');
const parsePage = require('./lib/parse-page');
const parseDocs = require('./lib/parse-docs');

module.exports = class Spacedoc {
  /**
   * Create a new Spacedoc parser.
   * @param {SpacedocParserOptions} [options={}] - Parser options.
   */
  constructor(options = {}) {
    this.options = getConfig(options);
    this.getPage = parsePage(this.options);
    this.getDoclets = parseDocs(this.options.adapters);
  }

  /**
   * Parse all documentation pages and code.
   * @returns {Promise.<SpacedocData>} Promise containing parsed pages and doclets.
   */
  parse() {
    const output = {
      pages: [],
      docs: {}
    };

    this.options.adapters.forEach((adapter, name) => {
      output.docs[name] = [];
    });

    const tasks = [];

    if (this.options.pages) {
      const pagesGlob = path.join(process.cwd(), this.options.pages, '**/*.md');
      const parsePages = files => files.forEach(file => {
        output.pages.push(this.getPage(file));
      });

      tasks.push(globby(pagesGlob).then(parsePages));
    }

    if (this.options.docs && this.options.adapters.size > 0) {
      const extensions = flatten([...this.options.adapters.values()].map(a => a.extensions || []));
      const docsGlob = this.options.docs.map(pattern =>
        path.join(pattern, `**/*.${extensions.length === 1 ? extensions[0] : `{${extensions.join(',')}`}`)
      );
      const parseDocs = files => Promise.all(files.map(file => {
        return this.getDoclets(file).then(res => {
          if (res.adapter) {
            output.docs[res.adapter].push(...res.doclets);
          }
        });
      }));

      tasks.push(globby(docsGlob).then(parseDocs));
    }

    return Promise.all(tasks).then(() => output);
  }
};
