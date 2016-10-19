const helpers = {
  sample: sample,
  type: type
}

module.exports = helpers;

function sample(item) {
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

function type(types = '') {
  return types.replace(/\s/g, '').replace('|', ' or ');
}
