const pify = require('pify');
const mkdirp = pify(require('mkdirp'));
const path = require('path');
const writeFile = pify(require('fs').writeFile);

/**
 * Search result item.
 * @typedef {Object} SearchResult
 * @prop {String} name - Item name.
 * @prop {String} type - Item type, which should include language and category.
 * @prop {String} description - Item description.
 * @prop {String} link - URL to the item.
 * @prop {String[]} tags - Aliases for this item.
 */

/**
 * Generates a search file from the current tree of processed pages.
 * @param {string} outFile - Path to write to.
 * @returns {Promise} Promise which resolves when the search file has been written to disk.
 * @todo Add hashes for doclet results
 * @todo Make hashes for search result types configurable
 * @todo Fix search result page paths being relative
 */
module.exports = function buildSearch(outFile = this.options.search.output) {
  if (!outFile) {
    return Promise.reject(new Error('Spacedoc.buildSearch(): must specify a destination file'));
  }

  const tree = this.tree;
  const results = [].concat(this.options.search.extra);

  // Each item in the tree is a page
  for (let i in tree) {
    const item = tree[i];
    const link = path.relative(this.options.pageRoot, item.fileName).replace('md', 'html');
    const type = (() => {
      // Check for special page types
      for (let t in this.options.search.pageTypes) {
        const func = this.options.search.pageTypes[t];
        if (func(item)) {
          return t;
        }
      }

      return 'page';
    })();

    // Add the page itself as a search result
    results.push({
      type: type,
      name: item.title,
      description: item.description,
      link: link,
      tags: item.tags || []
    });

    // Generate search results for each doclet
    for (let a in this.adapters) {
      const doclets = item.docs[a];

      if (Array.isArray(doclets)) {
        results.push.apply(results, flatten(doclets).map(v => ({
          type: `${a} ${v.meta.type}`,
          name: v.meta.name,
          description: v.meta.description,
          link: link,
          tags: item.tags || [],
        })));
      }
    }
  }

  // Re-order search results based on search config
  results.sort((a, b) => {
    return this.options.search.sort.indexOf(a.type) - this.options.search.sort.indexOf(b.type);
  });

  // Write the finished results to disk
  return mkdirp(path.dirname(outFile))
    .then(() => writeFile(outFile, JSON.stringify(results, null, '  ')));
};

/**
 * Given an object with enteries that are all arrays, combine all those arrays together.
 * @private
 * @param {Object.<String, Array>} obj - Object to process.
 * @returns {Array} Flattened array.
 */
function flatten(obj) {
  let output = [];
  Object.keys(obj).map(key => {
    output = output.concat(obj[key]);
  });
  return output;
}
