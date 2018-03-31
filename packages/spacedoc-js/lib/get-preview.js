/**
 * Create a preview snippet of a piece of JavaScript code.
 * @param {Object} item - Doclet to process.
 * @returns {String} Code preview.
 */
module.exports = item => {
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
};
