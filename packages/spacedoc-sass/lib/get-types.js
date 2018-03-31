/**
 * Convert SassDoc's string `@type` annotation into an array of types.
 * @param {String} type - Type string.
 * @returns {String[]} Array of types.
 * @example
 * getTypes(''); // => []
 * getTypes('String'); // => ['String']
 * getTypes('String | Number'); // => ['String', 'Number']
 */
module.exports = (type = '') => {
  return type.replace(/\s/g, '').split('|');
};
