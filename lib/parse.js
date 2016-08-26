const File        = require('vinyl');
const frontMatter = require('front-matter');
const fs          = require('fs');
const marked      = require('marked');
const path        = require('path');

/**
 * Data representation of a page. This object can be passed to `Spacedoc.build()` to render a full documentation page.
 * @typedef {Object} PageData
 * @prop {String} body - The main body of the page. This includes everything other than the Front Matter at the top. It's usually Markdown or HTML.
 * @prop {String} fileName - Path to the page, relative to the root page, which is defined by `options.pageRoot`.
 * @prop {Object.<String, Object>} docs - Documentation data. Each key is the name of an adapter, such as `sass` or `js`, and each value is the data that adapter found.
 * @prop {Object} _frontMatter - Original Front Matter included in the page.
 */

/**
 * Parses a single documentation page, collecting the needed documentation data based on the settings in the page's Front Matter. The file is not modified in the process.
 *
 * @example <caption>Use without Gulp. A Vinyl file must be created manually.</caption>
 * const File = require('vinyl');
 * fs.readFile('page.html', (err, contents) => {
 *   const page = new File({
 *     path: 'page.html',
 *     contents: contents
 *   });
 *   Spacedoc.parse(page).then(data => {
 *     // data is an object
 *   })
 * })
 *
 * @param {Vinyl} file - File to parse.
 * @param {InitOptions} opts - Extra parsing options.
 * @returns {Promise.<PageData>} Promise containing raw page data.
 */
module.exports = function parse(file, opts = {}) {
  if (typeof file === 'string') {
    try {
      file = new File({
        path: file,
        contents: fs.readFileSync(file)
      });
    }
    catch (e) {
      return new Promise((resolve, reject) => reject(new Error(`Spacedoc.parse(): error loading file ${file}`)));
    }
  }

  let page = {};
  const pageData = frontMatter(file.contents.toString());

  // Global attributes
  page = pageData.attributes;
  page._frontMatter = Object.assign({}, pageData.attributes);
  page.body = '';
  page.fileName = path.relative(process.cwd(), file.path);

  // Catch Markdown errors
  if (this.options.marked && path.extname(page.fileName) === '.md') {
    try {
      page.body = marked(pageData.body, { renderer: this.options.marked });
    }
    catch (e) {
      return Promise.reject(new Error(`Marked error: ${e.message}`));
    }
  }
  else {
    page.body = pageData.body;
  }

  // Run each adapter's parser, if the page references it
  const adapters = page.docs || {};
  const parsers = Object.keys(this.adapters).filter(lib => lib in adapters).map(lib => {
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

  // When all adapter data has been collected, add it to the page object
  return Promise.all(parsers).then(results => {
    for (let res of results) {
      page.docs[res.adapter] = res.data;
    }

    // For complete builds, push all pages to the tree
    if (!opts.incremental) {
      this.tree.push(page);
    }
    // For incremental builds, we have to figure out if the page already exists in the tree or not
    else {
      // Look for a page in the tree with a matching filename
      const key = findByKey(this.tree, 'fileName', page.fileName);

      // If that page exists, we replace the existing page with the revised one
      if (key > -1) {
        this.tree[key] = page;
      }
      // Otherwise, we add the new page to the end of the tree
      else {
        this.tree.push(page);
      }
    }

    return page;
  });
}

/**
 * Find an object in an array with a specific key/value pair.
 * @private
 * @param {Array} array - Array to search.
 * @param {String} key - Key to match.
 * @param {*} value - Value to match.
 * @returns {Number} Index of matched object, or `-1` if no match was found.
 */
function findByKey(array, key, value) {
  for (let i in array) {
    if (array[i][key] && array[i][key] === value) {
      return i;
    }
  }
  return -1;
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
