const filter = require('lodash.filter');
const _find = require('lodash.find');

/**
 * Build a template helper function to find doclets assigned to the page being rendered. The function created is an alias for lodash's `find()` function. The function also filters out private doclets.
 * @param {Object.<String, Doclet[]>} doclets - Set of doclets to search.
 * @param {Boolean} [inheritAccess=true] - Filter out an item if any of its ancestors are private.
 * @returns {PageFindFunction} Find function.
 */
module.exports = function (doclets = {}, inheritAccess = true) {
  /**
   * Find a doclet within a specific adapter's data set.
   * @callback PageFindFunction
   * @param {String} scope - Adapter data to search in.
   * @param {*} predicate - Argument to pass to `lodash.filter`.
   * @returns {?Object[]} List of doclets, or `undefined` if none were found.
   * @todo Make visibility of private doclets configurable.
   */
  function find(scope, predicate = {}) {
    if (scope in doclets) {
      // Uses the passed-in predicate to find an initial list
      // Then filters out private items
      return filter(doclets[scope], predicate).filter(doclet => {
        if (doclet.access === 'private') {
          return false;
        }

        if (inheritAccess) {
          for (
            let item = doclet;
            typeof item !== 'undefined';
            item = _find(doclets[scope], ['meta.longname', item.parent])
          ) {
            if (item.access === 'private') {
              return false;
            }
          }

          return true;
        }

        return true;
      });
    }

    return [];
  }

  return find;
};
