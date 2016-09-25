/**
 * Create a function that accesses documentation information for the current page. The function is passed to a template engine.
 * @param {PageData} page - Page to access.
 * @returns {PageAccessorFunction} Function to access docs info.
 */
module.exports = function helper(page) {
  /**
   * Template function to access documentation info for the current page.
   * @typedef PageAccessorFunction
   * @param {String} adapter - Adapter to reference.
   * @param {(String|Object)} accessor - Specific doclet to get. Can be a string, which will look for a doclet with a specific name, or an object, which will be used to find a doclet with a matching key/value pair.
   * @returns {String} Rendered documentation HTML.
   */
  return (adapter, accessor = null) => {
    if (adapter in page.docs) {
      return this.adapters[adapter].template({
        groups: page.docs[adapter],
        find: keys => filter(page.docs[adapter], keys),
        helpers: Object.assign({}, helpers, this.adapters[adapter].helpers),
      });
    }
    return '';
  }
}
