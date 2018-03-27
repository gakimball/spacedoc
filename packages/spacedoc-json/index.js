const path = require('path');

/**
 * Convert one or more JSON Schemas into a set of doclets for use in a Spacedoc template.
 * @param {(String|String[])} value - Paths to process.
 * @param {Object} [config={}] config - Adapter configuration.
 * @returns {SpacedocDoclet[]} Spacedoc doclets.
 */
module.exports = (value, config = {}) => {
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
}

module.exports.adapterName = 'json';
module.exports.extensions = ['json'];

/**
 * Parse an item within a JSON Schema, transferring its common properties to Spacdoc's doclet standard. If the item is an array of object, and defines sub-properties, those sub-properties will be recursively parsed.
 * @param {Object} item - JSON Schema.
 * @param {String} filePath - Path to JSON file being parsed.
 * @param {String} [name='root'] - Object key of item being parsed.
 * @returns {SpacedocDoclet} Spacedoc doclet.
 * @todo Strip `undefined` properties from the final doclet object.
 */
function parseItem(item, filePath, name = 'root') {
  const doclet = {
    meta: {
      name: item.title,
      longname: name,
      description: item.description,
      file: {
        path: filePath,
        name: path.basename(filePath)
      }
    },
    types: getTypes(item.type),
    value: item.default,
  }

  // For object types with properties, add the properties to the `properties` and `children` property of the doclet.
  if (item.properties) {
    doclet.properties = [];
    doclet.children = [];

    Object.keys(item.properties).map(prop => {
      const property = item.properties[prop];

      doclet.properties.push({
        name: prop,
        types: getTypes(property.type),
        description: property.description,
        default: property.default,
      });

      doclet.children.push(
        parseItem(item.properties[prop], filePath, prop)
      );
    });
  }

  // For array types with items, add the item schema to the `children` property of the doclet.
  if (item.items) {
    doclet.children = [parseItem(item.items, filePath, `${name}.items`)];
  }

  return doclet;
}

/**
 * Normalize the `type` property of a JSON Schema item, which can be a string, array, or undefined, to always be an array.
 * @param {(String|Number)} type - Type(s) to parse.
 * @returns {String[]} Array-formatted types.
 * @example
 * getTypes(); // => []
 * getTypes('string'); // => ['string']
 * getTypes(['string', 'number']); // => ['string', 'number']
 */
function getTypes(type) {
  if (type) {
    if (Array.isArray(type)) {
      return type;
    }
    else {
      return [type];
    }
  }
  else {
    return [];
  }
}

module.exports.parseItem = parseItem;
module.exports.getTypes = getTypes;
