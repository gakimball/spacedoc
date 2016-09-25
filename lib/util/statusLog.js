const { cyan, magenta, yellow } = require('chalk');
const { log } = require('gulp-util');

/**
 * Logs the completion of a page being processed to the console.
 * @private
 * @param {string} file - Name of the file.
 * @param {object} data - Data object associated with the file. The list of adapters is pulled from this.
 * @param {integer} time - Time it took to process the file.
 */
module.exports = function statusLog(file, data, time) {
  let msg = '';
  const diff = (process.hrtime(time)[1] / 1000000000).toFixed(2) + 's';
  const adapters = Object.keys(data.docs).join(', ');

  msg += `Spacedoc: processed ${cyan(file)} in ${magenta(diff)}`;

  if (adapters.length) {
    msg += ` with ${yellow(adapters)}`;
  }

  log(msg);
}
