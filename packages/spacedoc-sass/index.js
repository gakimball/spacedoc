const escapeHTML = require('escape-html');
const path = require('path');
const sassdoc = require('sassdoc');

/**
 * Parse one or more Sass files and create a series of Spacedoc doclets.
 * @param {(String|String[])} value - Files to process.
 * @param {Object} [config={}] config - SassDoc configuration.
 * @returns {Promise.<SpacedocDoclet[]>} Promise containing Spacedoc doclets.
 */
module.exports = (value, config = {}) => {
  console.log(value);
  return sassdoc.parse(value, config).then(items => items.map(parseItem));
}

module.exports.adapterName = 'sass';
module.exports.order = ['variable', 'mixin', 'function', 'placeholder'];
module.exports.getTypes = getTypes;
module.exports.getPreview = getPreview;

/**
 * Convert a SassDoc doclet into Spacedoc's doclet format.
 * @param {Object} item - SassDoc doclet.
 * @returns {SpacedocDoclet} Spacedoc doclet.
 */
function parseItem(item) {
  return {
    meta: {
      name: item.context.name,
      longname: item.context.name,
      type: item.context.type,
      description: item.description,
      code: {
        start: item.context.line.start,
        end: item.context.line.end,
        commentStart: item.commentRange.start,
        commentEnd: item.commentRange.end,
      },
      file: {
        path: item.file.path,
        name: item.file.name,
      },
    },
    types: getTypes(item.type),
    preview: getPreview(item),
    value: item.context.value,
    alias: item.alias,
    aliased: item.aliased,
    access: item.access,
    deprecated: item.deprecated,
    parameters: (item.parameter || []).map(param => ({
      name: param.name,
      types: getTypes(param.type),
      description: param.description,
      default: param.default,
    })),
    properties: (item.property || []).map(param => ({
      name: param.name,
      types: getTypes(param.type),
      description: param.description,
      default: param.default,
    })),
    throws: (item.throw || []).map(thrw => ({
      description: thrw,
    })),
    examples: (item.example || []).map(example => ({
      language: example.type,
      code: example.code,
      description: example.description,
    })),
    returns: (item.return ? {
      types: getTypes(item.return.type),
      description: item.return.description,
    } : null),
    links: (item.link || []).map(link => ({
      url: link.url,
      description: link.caption,
    })),
    changelog: (item.since || []).map(since => ({
      version: since.version,
      description: since.description,
    })),
    groups: item.group,
    outputs: item.output,
  }
}

/**
 * Convert SassDoc's string `@type` annotation into an array of types.
 * @param {String} type - Type string.
 * @returns {String[]} Array of types.
 * @example
 * getTypes(''); // => []
 * getTypes('String'); // => ['String']
 * getTypes('String | Number'); // => ['String', 'Number']
 */
function getTypes(type = '') {
  return type.replace(/\s/g, '').split('|');
}

/**
 * Generate a preview of a doclet.
 * @param {Object} item - SassDoc doclet to use.
 * @returns {String} Code preview of doclet.
 * @todo Display parameters in function and mixin previews.
 *
 * @example <caption>Variable preview.</caption>
 * $variable: 'value';
 *
 * @example <caption>Function preview.</caption>
 * function();
 *
 * @example <caption>Mixin preview.</caption>
 * @include mixin();
 *
 * @example <caption>Placeholder preview.</caption>
 * @extend %placeholder;
 */
function getPreview(item) {
  switch (item.context.type) {
    case 'variable':
      return `$${item.context.name}: ${item.context.value};`;
    case 'function':
      return `${item.context.name}();`;
    case 'mixin':
      return `@include ${item.context.name}();`;
    case 'placeholder':
      return `@extend %${item.context.name};`;
    default:
      return item.context.name;
  }
}
