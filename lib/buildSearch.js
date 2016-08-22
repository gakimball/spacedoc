var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

/**
 * Generates a search file from the current tree of processed pages.
 * @param {string} outFile - Path to write to.
 * @todo Make hashes for search result types configurable
 */
module.exports = function(outFile) {
  var tree = this.tree;
  var results = [];

  results = results.concat(this.searchOptions.extra);

  // Each item in the tree is a page
  for (var i in tree) {
    var item = tree[i];
    var link = path.relative(this.options.pageRoot, item.fileName).replace('md', this.options.extension);
    var type = 'page';

    // By default pages are classified as a "page"
    // If it has code associated with it, then it's a "component" instead.
    if (keysInObject(item, Object.keys(this.adapters))) {
      type = 'component';
    }

    // Check for special page types
    for (var t in this.searchOptions.pageTypes) {
      var func = this.searchOptions.pageTypes[t];
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
    for (var a in this.adapters) {
      if (this.adapters[a].search && item[a]) {
        results = results.concat(this.adapters[a].search(item[a], link));
      }
    }
  }

  // Re-order search results based on search config
  results = results.sort((a, b) => {
    return this.searchOptions.sort.indexOf(a.type) - this.searchOptions.sort.indexOf(b.type);
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
 * @param {object} obj - Object to check for keys.
 * @param {array} keys - Keys to check.
 * @returns {boolean} `true` if any key is found on the object, or `false` if not.
 */
function keysInObject(obj, keys) {
  for (var i in keys) {
    if (keys[i] in obj) return true;
  }
  return false;
}
