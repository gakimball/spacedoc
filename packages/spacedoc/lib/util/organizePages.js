const path = require('path');

/**
 * Array sorting function to organize pages by filename. Pages prefixed with numbers will sort to the top.
 * @param {Page} a - Page A.
 * @param {Page} b - Page B.
 * @returns {Integer} Number indicating sort direction.
 */
module.exports = function organizePages(a, b) {
  const pathA = path.basename(a.fileName).toLowerCase();
  const pathB = path.basename(b.fileName).toLowerCase();
  let numA;
  let numB;

  // Look for paths with a leading number, e.g. 1-intro.md or 02-installation.html
  if (pathA.match(/^\d+-/)) {
    numA = parseInt(pathA.split('-')[0]);
  }
  if (pathB.match(/^\d+-/)) {
    numB = parseInt(pathB.split('-')[0]);
  }

  // If both paths have a numeric prefix, compare the numbers
  if (numA && numB) {
    return numA - numB;
  }
  // If path A has a numeric prefix but path B doesn't, sort it above
  else if (numA && !numB) {
    return -1;
  }
  // Likewise, if the reverse is true, sort it below
  else if (!numA && numB) {
    return 1;
  }

  // If neither path has a numeric prefix, compare the strings
  if (pathA < pathB) return -1;
  if (pathA > pathB) return 1;
  return 0;
}
