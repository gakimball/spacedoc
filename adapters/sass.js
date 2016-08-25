const escapeHTML = require('escape-html');
const sassdoc = require('sassdoc');

class SassDocParser {
  static parse(value, config) {
    return sassdoc.parse(value, config).then(function(data) {
      return data;
    });
  }

  static group(item) {
    return item.context.type;
  }

  static filter(item) {
    return item.access === 'private'
  }

  static search(item, link) {
    return {
      name: item.context.name,
      type: `sass ${item.context.type}`,
      description: escapeHTML(item.description.replace(/(\n|`)/, '')),
      link: `${link}#sass_${item.context.type}_${item.context.name}`
    }
  }

  static config() {
    return {
      verbose: false
    }
  }
}

module.exports = SassDocParser;
