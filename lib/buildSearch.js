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

  results = results.concat(this.options.search.extra);

  // Each item in the tree is a page
  for (var i in tree) {
    var item = tree[i];
    var link = path.relative(this.options.pageRoot, item.fileName).replace('md', this.options.extension);
    var type = 'page';

    // By default pages are classified as a "page"
    // If it has code associated with it, then it's a "component" instead.
    if (keysInObject(item.docs, Object.keys(this.adapters))) {
      type = 'component';
    }

    // Check for special page types
    for (var t in this.options.search.pageTypes) {
      var func = this.options.search.pageTypes[t];
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

function flatten(obj) {
  let output = [];
  Object.keys(obj).map(key => output = output.concat(obj[key]));
  return output;
}
