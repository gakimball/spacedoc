const path = require('path');
const getTypes = require('./get-types');

/**
 * Parse an item within a JSON Schema, transferring its common properties to Spacdoc's doclet standard. If the item is an array of object, and defines sub-properties, those sub-properties will be recursively parsed.
 * @param {Object} item - JSON Schema.
 * @param {String} filePath - Path to JSON file being parsed.
 * @param {String} [name='root'] - Object key of item being parsed.
 * @returns {SpacedocDoclet} Spacedoc doclet.
 * @todo Strip `undefined` properties from the final doclet object.
 */
const parseItem = (item, filePath, name = 'root') => {
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
    value: item.default
  };

  // For object types with properties, add the properties to the `properties` and `children` property of the doclet.
  if (item.properties) {
    doclet.properties = [];
    doclet.children = [];

    Object.keys(item.properties).forEach(prop => {
      const property = item.properties[prop];

      doclet.properties.push({
        name: prop,
        types: getTypes(property.type),
        description: property.description,
        default: property.default
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
};

module.exports = parseItem;
