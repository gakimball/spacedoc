const helpers = require('spacedoc-helpers');
const filter = require('lodash.filter');

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
   * @param {?String} group - Group of doclets to get. Omit to get all doclets.
   * @param {?name} name - Name of doclet within group to get. Omit to get all doclets in a group.
   * @returns {String} Rendered documentation HTML.
   */
  return (adapter, group = null, name = null) => {
    if (adapter in page.docs) {
      // If a group is set, filter items by the group property of the adapter
      const predicate = group === null
        ? () => true
        : { [this.adapters[adapter].group]: group };

      // If a name is set, add an extra filter criteria
      if (name) {
        predicate[this.adapters[adapter].itemName] = name;
      }

      // Render the adapter's template with these locals
      return this.adapters[adapter].template({
        // Doclets
        groups: filter(page.docs[adapter], predicate),
        // Function to query for other doclets
        find: keys => filter(page.docs[adapter], keys),
        // Global helper functions, and adapter-specific helper functions
        helpers: Object.assign({}, helpers, this.adapters[adapter].helpers),
      });
    }
    return '';
  }
}
