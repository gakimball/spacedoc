module.exports = {
  sample,
  type
}

function sample(item) {
  switch (item.kind) {
    case 'class': {
      return `new ${item.longname}();`;
    }
    case 'function': {
      return `${item.longname.replace(/#/g, '.')}();`;
    }
    default: {
      return false;
    }
  }
}

function type(types) {
  if (!types || !types.names) return '';

  return types.names.join(' or ');
}
