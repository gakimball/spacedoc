const path = require('path');
const replaceBase = require('replace-basename');
const replaceExt = require('replace-ext');

/**
 * Process the file path of a documentation page.
 *   - If the file has leading digits (e.g., `01-intro.md`), they will be removed.
 *   - If `newExtension` is passed as a parameter, the file's extension will be changed.
 * @param {String} filePath - Full file path to process.
 * @param {String} [newExtension] - New extension to use.
 * @returns {String} Modified file path.
 * @todo Add pageRoot processing.
 */
module.exports = function processFilePath(filePath, newExtension) {
  let newPath = replaceBase(filePath, p => p.replace(/^\d+-/, ''));

  if (newExtension) {
    newPath = replaceExt(newPath, `.${newExtension}`);
  }

  return newPath;
}
