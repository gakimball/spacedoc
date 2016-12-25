const path = require('path');

/**
 * Array sorting function to organize pages by filename and order. Pages with a defined order will sort to the top.
 * @param {Page} a - Page A.
 * @param {Page} b - Page B.
 * @returns {Integer} Number indicating sort direction.
 */
module.exports = function sortPages(a, b) {
  const pathA = path.basename(a.fileName).toLowerCase();
  const pathB = path.basename(b.fileName).toLowerCase();
  let numA;
  let numB;

  // Check if a page has a defined number
  if (a.order) {
    numA = a.order;
  }
  if (b.order) {
    numB = b.order;
  }

  // If both paths have an order, compare the numbers
  if (numA && numB) {
    return numA - numB;
  }
  // If path A has an order but path B doesn't, sort it above
  else if (numA && !numB) {
    return -1;
  }
  // Likewise, if the reverse is true, sort it below
  else if (!numA && numB) {
    return 1;
  }

  // If neither path has an order, compare the strings
  if (pathA < pathB) return -1;
  if (pathA > pathB) return 1;
  return 0;
}
