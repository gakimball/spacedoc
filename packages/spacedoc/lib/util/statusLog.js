const { cyan, magenta, yellow } = require('chalk');
const { log } = require('gulp-util');

/**
 * Logs the completion of a page being processed to the console.
 * @private
 * @param {String} filePath - Original file path.
 * @param {PageData} page - Page being logged. The list of adapters is pulled from this.
 */
module.exports = function statusLog(filePath, page) {
  let msg = '';
  const adapters = Object.keys(page.docs).join(', ');

  msg += `Spacedoc: processed ${cyan(filePath)}`;

  if (adapters.length) {
    msg += ` with ${yellow(adapters)}`;
  }

  log(msg);
}
