const File = require('vinyl');
const findIndex = require('lodash.findindex');
const frontMatter = require('front-matter');
const fs = require('fs');
const marked = require('marked');
const path = require('path');

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
 * @param {(Vinyl|String)} file - File to parse, or a path to a file to parse.
 * @param {InitOptions} opts - Extra parsing options.
 * @returns {Promise.<PageData>} Promise containing raw page data.
 */
module.exports = function parse(file, opts = {}) {
  // If a string path is passed instead of a Vinyl file, create a new file from the string
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

  // When all adapter data has been collected, add it to the page object
  return this.parseDocs(page.docs).then(results => {
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
      const key = findIndex(this.tree, { fileName: page.fileName });

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
