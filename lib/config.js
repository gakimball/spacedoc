const extend = require('util')._extend;
const fs = require('fs');
const path = require('path');
const Renderer = require('marked').Renderer;
const yml = require('js-yaml');

module.exports = function(opts = {}) {
  var fileData;

  this.options = Object.assign({
    config: {},
    data: {},
    extension: 'html',
    handlebars: require('handlebars'),
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
  if (this.options.template) {
    try {
      fileData = fs.readFileSync(this.options.template);
    }
    catch (e) {
      throw new Error('Error loading Supercollider template file: ' + e.message);
    }

    this.template = this.options.handlebars.compile(fileData.toString(), {noEscape: true});
  }

  // Load extra results from an external file
  if (opts.search && typeof opts.search.extra === 'string') {
    var fileContents = fs.readFileSync(opts.search.extra);
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
