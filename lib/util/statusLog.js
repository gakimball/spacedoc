const { cyan, magenta, yellow } = require('chalk');
const { log } = require('gulp-util');

/**
 * Logs the completion of a page being processed to the console.
 * @private
 * @param {string} file - Name of the file.
 * @param {object} data - Data object associated with the file. The list of adapters is pulled from this.
 */
module.exports = function statusLog(file, data) {
  let msg = '';
  const adapters = Object.keys(data.docs).join(', ');

  msg += `Spacedoc: processed ${cyan(file)}`;

  if (adapters.length) {
    msg += ` with ${yellow(adapters)}`;
  }

  log(msg);
}
