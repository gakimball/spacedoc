const escapeHTML = require('escape-html');
const jsdoc = require('jsdoc-api');
const path = require('path');

/**
 * Parse a series of JavaScript files using JSDoc and generate a set of doclets.
 * @param {(String|String[])} value - File(s) to process.
 * @returns {SpacedocDoclet[]} Spacedoc doclets.
 */
module.exports = function(value) {
  return jsdoc.explain({ files: value })
    .then(items => items.filter(filterItem).map(parseItem));
}

module.exports.adapterName = 'js';
module.exports.order = ['class', 'constant', 'event', 'function', 'module', 'namespace', 'typedef'];
module.exports.extensions = ['js', 'jsx'];

// @todo Move these exports to a separate file so they can still be tested but not exported here
module.exports.getPreview = getPreview;
module.exports.getTypes = getTypes;
module.exports.getExample = getExample;

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
    item.undocumented !== true
    && item.ignore !== true
    && item.kind !== 'package';

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
        start: item.meta.lineno,
      },
      file: {
        path: path.join(item.meta.path, item.meta.filename),
        name: item.meta.filename,
      }
    },
    types: getTypes(item.type),
    preview: getPreview(item),
    value: item.meta.code.value,
    parent: item.memberof,
    // alias:,
    // aliased:
    access: item.access,
    deprecated: item.deprecated,
    this: item.this,
    parameters: (item.params || []).map(param => ({
      name: param.name,
      types: getTypes(param.type),
      description: param.description,
      // default: param.default,
      nullable: param.nullable,
      optional: param.optional,
    })),
    properties: (item.properties || []).map(param => ({
      name: param.name,
      types: getTypes(param.type),
      description: param.description,
      // default: param.default,
      nullable: param.nullable,
      optional: param.optional,
    })),
    // requires:,
    // requiredBy:,
    throws: (item.exceptions || []).map(exception => ({
      types: getTypes(exception.type),
      description: exception.description,
    })),
    examples: (item.examples || []).map(example => getExample(example)),
    returns: (item.returns ? {
      types: getTypes(item.returns[0].type),
      description: item.returns[0].description,
    } : {}),
    // links:,
    // changelog:,
    fires: item.fires,
    listens: item.listens,
    extends: item.augments,
    // group:,
  }
}

/**
 * Create a preview snippet of a piece of JavaScript code.
 * @param {Object} item - Doclet to process.
 * @returns {String} Code preview.
 */
function getPreview(item) {
  let preview;

  switch (item.kind) {
    case 'class':
      preview = `new ${item.longname}();`;
      break;
    case 'function':
      preview = `${item.longname.replace(/#/g, '.')}();`;
      break;
    default:
      preview = null;
  }

  if (preview) {
    return {
      code: preview,
      language: 'js',
    };
  }
  else {
    return false;
  }
}

/**
 * Pull the list of types out of the `types` property of a JSDoc doclet.
 * @param {Object} types - JSDoc type definition.
 * @returns {String[]} List of types.
 */
function getTypes(types) {
  if (!types || !types.names) return [];

  return types.names;
}

/**
 * Parse a JSDoc `@example` annotation.
 * @param {String} example - Example contents.
 * @returns {Object} Formatted object containing example info.
 */
function getExample(example) {
  const match = example.match(/^<caption>(.+?)<\/caption>\n(.*)$/);

  // Example with caption
  if (match) {
    return {
      language: 'js',
      description: match[1],
      code: match[2],
    };
  }

  // Example with no caption
  return {
    language: 'js',
    code: example,
  };
}
