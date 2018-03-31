const path = require('path');
const parseItem = require('./lib/parse-item');

/**
 * Convert one or more JSON Schemas into a set of doclets for use in a Spacedoc template.
 * @param {(String|String[])} value - Paths to process.
 * @returns {SpacedocDoclet[]} Spacedoc doclets.
 */
module.exports = (value) => {
  if (typeof value === 'string') {
    value = [value];
  }

  return new Promise((resolve, reject) => {
    if (Array.isArray(value)) {
      resolve(value.map(val => {
        const schema = require(path.join(process.cwd(), val));
        return parseItem(schema, val);
      }));
    }
    else {
      reject('The input value must be a single path or an array of paths.');
    }
  });
};

module.exports.adapterName = 'json';
module.exports.extensions = ['json'];
