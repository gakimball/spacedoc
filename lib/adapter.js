const path = require('path');

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
module.exports = function(adapter) {
  // Load a built-in module if available
  if (typeof adapter === 'string') {
    try {
      adapter = require(path.join('../adapters/', adapter));
    }
    catch (e) {
      throw new Error(`Spacedoc.adapter(): "${adapter}" is not a built-in Spacedoc adapter.`);
    }
  }

  // Make sure the adapter is an object with both of the required methods.
  if (typeof adapter !== 'function') {
    throw new Error('Spacedoc.adapter(): Adapters must be classes.')
  }

  if (!adapter.name || typeof adapter.name() !== 'string') {
    throw new Error('Spacedoc.adapter(): adapters must have a name() method that returns a string.');
  }

  this.adapters[adapter.name()] = adapter;

  return this;
}
