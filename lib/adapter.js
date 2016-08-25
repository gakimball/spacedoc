var path = require('path');

/**
 * Enable a built-in adapter, or define a custom one. The built-in adapters are `sass` and `js`. They can also be overwritten with a custom class.
 *
 * @example <caption>Enabling a built-in adapter:</caption>
 * Spacedoc.adapter('sass');
 *
 * @example <caption>Adding a custom adapter:</caption>
 * const RDocParser = require('./rdocparser');
 * Spacedoc.adapter('ruby', RDocParser);
 *
 * @param {String} name - Name of adapter.
 * @param {Class} func - Adapter class.
 * @throws Will throw an error if a non-existant built-in adapter is referenced.
 * @throws Will throw an error if the second parameter is not a function.
 */
module.exports = function(name, func) {
  // Load a built-in module if available
  if (typeof func === 'undefined') {
    try {
      func = require(path.join('../adapters/', name));
    }
    catch (e) {
      throw new Error('"'+name+'" is not a built-in Spacedoc adapter.');
    }
  }

  // Don't use one of the built-in meta terms
  var reserved = ['docs', 'fileName', '_adapterData'];
  for (var i in reserved) {
    if (name === reserved[i]) {
      throw new Error('"'+name+'" is a reserved keyword, and can\'t be used as the name of a Spacedoc adapter.');
    }
  }

  // Make sure the adapter is an object with both of the required methods.
  if (typeof func !== 'function') {
    throw new Error('Spacedoc adapters must be functions.')
  }

  // If no config object exists, add it
  if (!func.config) func.config = {};

  this.adapters[name] = func;

  return this;
}
