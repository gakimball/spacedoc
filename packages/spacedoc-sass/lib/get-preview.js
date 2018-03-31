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
module.exports = item => {
  let preview;

  switch (item.context.type) {
    case 'variable':
      preview = `$${item.context.name}: ${item.context.value};`;
      break;
    case 'function':
      preview = `${item.context.name}();`;
      break;
    case 'mixin':
      preview = `@include ${item.context.name}();`;
      break;
    case 'placeholder':
      preview = `@extend %${item.context.name};`;
      break;
    default:
      preview = '';
  }

  return {
    code: preview,
    language: 'scss'
  };
};
