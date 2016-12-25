const path = require('path');
const replaceBase = require('replace-basename');
const replaceExt = require('replace-ext');

/**
 * Process the file path of a documentation page. This is used by `Spacedoc.parse()`.
 *   - Generates a new path relative to a root.
 *   - If the file has leading digits (e.g., `01-intro.md`), they will be removed.
 *   - If `newExtension` is passed as a parameter, the file's extension will be changed.
 * @param {String} filePath - Full file path to process.
 * @param {String} [pageRoot] - Root directory.
 * @param {String} [newExtension] - New extension to use.
 * @returns {String} Modified file path.
 */
module.exports = function getPageFileName(filePath, pageRoot, newExtension) {
  // Generate a path relative to the page root
  let newPath = path.relative(pageRoot || '', filePath);

  // Remove leading numbers from a file name, e.g. 01-index.md -> index.md
  newPath = replaceBase(newPath, p => p.replace(/^\d+-/, ''));

  // If the name of the file is "readme.md", rename it to "index"
  if (path.basename(newPath).toLowerCase() === 'readme.md') {
    newPath = replaceBase(newPath, 'index');
  }

  // Change file extension if needed
  if (newExtension) {
    newPath = replaceExt(newPath, `.${newExtension}`);
  }

  return newPath;
}
