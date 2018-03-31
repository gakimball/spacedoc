/**
 * Normalize the `type` property of a JSON Schema item, which can be a string, array, or undefined, to always be an array.
 * @param {(String|Number)} type - Type(s) to parse.
 * @returns {String[]} Array-formatted types.
 * @example
 * getTypes(); // => []
 * getTypes('string'); // => ['string']
 * getTypes(['string', 'number']); // => ['string', 'number']
 */
module.exports = type => {
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
};
