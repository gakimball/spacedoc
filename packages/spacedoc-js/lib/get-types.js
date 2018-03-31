/**
 * Pull the list of types out of the `types` property of a JSDoc doclet.
 * @param {Object} types - JSDoc type definition.
 * @returns {String[]} List of types.
 */
module.exports = types => {
  if (!types || !types.names) {
    return [];
  }

  return types.names;
};
