const path = require('path');
const jsdoc = require('jsdoc-api');
const getPreview = require('./lib/get-preview');
const getTypes = require('./lib/get-types');
const getExample = require('./lib/get-example');

/**
 * Parse a series of JavaScript files using JSDoc and generate a set of doclets.
 * @param {(String|String[])} value - File(s) to process.
 * @returns {SpacedocDoclet[]} Spacedoc doclets.
 */
module.exports = function (value) {
  return jsdoc.explain({files: value})
    .then(items => items.filter(filterItem).map(parseItem));
};

module.exports.adapterName = 'js';
module.exports.order = ['class', 'constant', 'event', 'function', 'module', 'namespace', 'typedef'];
module.exports.extensions = ['js', 'jsx'];

/**
 * Filter a JSDoc doclet from Spacedoc.
 *   - Items with no JSDoc comments are filtered out.
 *   - Items with an `@ignore` annotation are filtered out, per JSDoc rules.
 *   - Packages are filtered out. (This could change in the future, but they aren't as useful given the way Spacedoc assembles documentation.)
 *
 * @param {Object} item - JSDoc doclet.
 * @returns {Boolean} If the item should be kept.
 */
function filterItem(item) {
  const cond =
    item.undocumented !== true &&
    item.ignore !== true &&
    item.kind !== 'package';

  return cond;
}

/**
 * Convert a JSDoc doclet into a Spacedoc doclet.
 * @param {Object} item - Input doclet.
 * @returns {SpacedocDoclet} Spacedoc doclet.
 */
function parseItem(item) {
  return {
    meta: {
      name: item.name,
      longname: item.longname,
      type: item.kind,
      description: item.description,
      code: {
        comment: item.comment,
        start: item.meta.lineno
      },
      file: {
        path: path.join(item.meta.path, item.meta.filename),
        name: item.meta.filename
      }
    },
    types: getTypes(item.type),
    preview: getPreview(item),
    value: item.meta.code.value,
    parent: item.memberof,
    // Alias:,
    // aliased:
    access: item.access,
    deprecated: item.deprecated,
    this: item.this,
    parameters: (item.params || []).map(param => ({
      name: param.name,
      types: getTypes(param.type),
      description: param.description,
      // Default: param.default,
      nullable: param.nullable,
      optional: param.optional
    })),
    properties: (item.properties || []).map(param => ({
      name: param.name,
      types: getTypes(param.type),
      description: param.description,
      // Default: param.default,
      nullable: param.nullable,
      optional: param.optional
    })),
    // Requires:,
    // requiredBy:,
    throws: (item.exceptions || []).map(exception => ({
      types: getTypes(exception.type),
      description: exception.description
    })),
    examples: (item.examples || []).map(example => getExample(example)),
    returns: (item.returns ? {
      types: getTypes(item.returns[0].type),
      description: item.returns[0].description
    } : {}),
    // Links:,
    // changelog:,
    fires: item.fires,
    listens: item.listens,
    extends: item.augments
    // Group:,
  };
}
