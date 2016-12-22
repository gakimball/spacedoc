const path = require('path');
const replaceBase = require('replace-basename');
const replaceExt = require('replace-ext');

/**
 * Process the file path of a documentation page.
 *   - If the file has leading digits (e.g., `01-intro.md`), they will be removed.
 *   - If `newExtension` is passed as a parameter, the file's extension will be changed.
 * @param {String} file - Full file path to process.
 * @param {String} [newExtension] - New extension to use.
 * @returns {String} Modified file path.
 * @todo Simplify string processing.
 */
module.exports = function processFilePath(file, newExtension) {
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  const replacement = base.replace(/^\d+-/, '');
  let newFile = replaceBase(file, replacement);

  if (newExtension) {
    newFile = replaceExt(newFile, `.${newExtension}`);
  }

  return newFile;
}
