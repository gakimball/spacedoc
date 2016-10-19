const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

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
 * @todo Make hashes for search result types configurable
 */
module.exports = function buildSearch(outFile = this.options.search.dest) {
  if (!outFile) {
    return Promise.reject(new Error('Spacedoc.buildSearch(): must specify a destination file'));
  }

  const tree = this.tree;
  let results = [];

  results = results.concat(this.options.search.extra);

  // Each item in the tree is a page
  for (let i in tree) {
    const item = tree[i];
    const link = path.relative(this.options.pageRoot, item.fileName).replace('md', this.options.extension);
    let type = 'page';

    // By default pages are classified as a "page"
    // If it has code associated with it, then it's a "component" instead.
    if (keysInObject(item.docs, Object.keys(this.adapters))) {
      type = 'component';
    }

    // Check for special page types
    for (let t in this.options.search.pageTypes) {
      const func = this.options.search.pageTypes[t];
      if (func(item)) {
        type = t;
      }
    }

    // Add the page itself as a search result
    results.push({
      type: type,
      name: item.title,
      description: item.description,
      link: link,
      tags: item.tags || []
    });

    // Run search builders for each adapter
    for (let a in this.adapters) {
      if (this.adapters[a].search && item.docs[a]) {
        results = results.concat(flatten(item.docs[a]).map(v => this.adapters[a].search(v, link)));
      }
    }
  }

  // Re-order search results based on search config
  results = results.sort((a, b) => {
    return this.options.search.sort.indexOf(a.type) - this.options.search.sort.indexOf(b.type);
  });

  // Write the finished results to disk
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(outFile), err => {
      if (err) reject(err);
      fs.writeFile(outFile, JSON.stringify(results, null, '  '), err => {
        if (err) reject(err);
        else resolve();
      });
    });
  })
}

/**
 * Determines if any key in an array exists on an object.
 * @private
 * @param {object} obj - Object to check for keys.
 * @param {array} keys - Keys to check.
 * @returns {boolean} `true` if any key is found on the object, or `false` if not.
 */
function keysInObject(obj, keys) {
  for (let i in keys) {
    if (keys[i] in obj) return true;
  }
  return false;
}

/**
 * Given an object with enteries that are all arrays, combine all those arrays together.
 * @private
 * @param {Object.<String, Array>} Object to process.
 * @returns {Array} Flattened array.
 */
function flatten(obj) {
  let output = [];
  Object.keys(obj).map(key => output = output.concat(obj[key]));
  return output;
}
