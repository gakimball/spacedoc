const path = require('path');

/**
 * Get the ordering of a page based on its filename.
 * @param {String} filePath - File name.
 * @returns {?Number} Page order, or `null` if no order.
 */
module.exports = function (filePath) {
  const fileName = path.basename(filePath);

  if (fileName.match(/^\d+-/)) {
    return parseInt(fileName.split('-')[0], 10);
  }

  return null;
};
