const frontMatter = require('front-matter');
const fs          = require('fs');
const marked      = require('marked');
const path        = require('path');

// Parses files according to the options passed to the constructor.
module.exports = function(file, opts = {}) {
  let page = {};
  const pageData = frontMatter(file.contents.toString());

  // Global attributes
  page = pageData.attributes;
  page._frontMatter = Object.assign({}, pageData.attributes);
  page.body = '';
  page.fileName = path.relative(process.cwd(), file.path);

  // Catch Markdown errors
  if (this.options.marked) {
    try {
      page.body = marked(pageData.body, { renderer: this.options.marked });
    }
    catch (e) {
      return Promise.reject(new Error('Marked error: ' + e.message));
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
      Adapter.parse(adapters[lib], config)
        .then(data => parseDataFromAdapter(Adapter, data))
        .then(data => resolve({ adapter: lib, data: data }))
        .catch(e => reject(e));
    });
  });

  return Promise.all(parsers).then(results => {
    for (var res of results) {
      page.docs[res.adapter] = res.data;
    }

    // For complete builds, push all pages to the tree
    if (!opts.incremental) {
      this.tree.push(page);
    }
    // For incremental builds, we have to figure out if the page already exists in the tree or not
    else {
      // Look for a page in the tree with a matching filename
      var key = findByKey(this.tree, 'fileName', page.fileName);

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

function findByKey(array, key, value) {
  for (var i in array) {
    if (array[i][key] && array[i][key] === value) {
      return i;
    }
  }
  return -1;
}

function parseDataFromAdapter(adapter, items) {
  let output = {};
  items.map(item => {
    if (!adapter.filter(item)) {
      const group = adapter.group(item);
      if (!output[group]) output[group] = [];
      output[group].push(item);
    }
  });
  return output;
}
