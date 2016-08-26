const escapeHTML = require('escape-html');
const jsdoc = require('jsdoc-api');

class JSDocParser {
  static name() {
    return 'js';
  }

  static parse(value, config) {
    return jsdoc.explain({ files: value }).then(function(data) {
      return data;
    });
  }

  static group(item) {
    return item.kind
  }

  static filter(item) {
    return item.undocumented === true || item.access === 'private';
  }

  static search(item, link) {
    return {
      name: item.name,
      type: `js ${item.kind}`,
      description: escapeHTML((item.description || '').replace('\n', '')),
      link: `${link}#js_${item.kind}_${item.name}`
    }
  }
}

module.exports = JSDocParser;
