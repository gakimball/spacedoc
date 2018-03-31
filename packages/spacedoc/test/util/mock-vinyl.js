const fs = require('fs');
const path = require('path');
const File = require('vinyl');

/**
 * Generate a mock Vinyl object from a file.
 * @param {String} filePath - File path.
 * @returns {Vinyl} Vinyl file with cwd, base, path, and contents set.
 */
module.exports = function (filePath) {
  return new File({
    cwd: process.cwd(),
    base: path.dirname(filePath),
    path: filePath,
    contents: fs.readFileSync(filePath)
  });
};
