const glob = require('glob').sync;
const path = require('path');
const pug = require('pug');

/**
 * Create an object of pre-compiled Pug template functions out of a folder of `.pug` files.
 * @param {String} folder - Directory to search.
 * @returns {Object.<String, Function>} Pug templates. Each key is the base name of the template file, and the value is a corresponding template function.
 * @throws Error when compiling a template file.
 */
module.exports = function(folder) {
  const templates = {};

  glob(`${folder}/**/*.pug`).map(file => {
    try {
      templates[path.basename(file, '.pug')] = pug.compileFile(file);
    }
    catch (e) {
      throw new Error(`Spacedoc: error loading template ${file}: ${e.message}`);
    }
  });

  return templates;
}
