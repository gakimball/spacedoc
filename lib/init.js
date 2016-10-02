const File = require('vinyl');
const fs = require('fs');
const isEmptyObject = require('is-empty-object');
const mkdirp = require('mkdirp').sync;
const path = require('path');
const replaceExt = require('replace-ext');
const statusLog = require('./util/statusLog');
const through = require('through2');
const vfs = require('vinyl-fs');

/**
 * Options that can be passed to `Spacedoc.init()`.
 * @typedef {Object} InitOptions
 * @prop {Boolean} [incremental=false] Enable incremental compiling. On subsequent runs of `Spacedoc.init()` (such as in a Gulp task, after a file has been saved), the plugin will not reset the cached list of pages.
 */

/**
 * Initialize Spacedoc, parsing a set of documentation pages and outputting HTML files. To call this function, `Spacedoc.config()` must have been called previously with the `template` parameter set.
 * This function can be called standalone, with the `src` and `dest` options having been set in `Spacedoc.config()`, or it can be called in a Gulp stream, and `src` and `dest` can be omitted.
 *
 * @example <caption>Use within a Gulp stream:</caption>
 *   gulp.src('docs/*.md')
 *     .pipe(Spacedoc.init())
 *     .pipe(gulp.dest('dist'));
 *
 * @example <caption>Use standalone:</caption>
 *   Spacedoc.init({
 *     src: 'docs/*.md',
 *     dest: 'dist'
 *   })
 *     .on('finish', () => {)
 *       // Parsing finished
 *     });
 *
 * @param {InitOptions} opts - Options for initialization.
 * @returns {Stream.Writable.<Vinyl>} A stream containing the modified files. You can add `on('finish')` after `Spacedoc.init()` to listen for when processing is done.
 */
module.exports = function init(opts = {}) {
  // Initialize options if Spacedoc.config() was not called
  if (isEmptyObject(this.options)) {
    this.config();
  }

  // Necessary because through2's end stream function below can't be an arrow function
  const _this = this;

  // Reset the internal data tree
  if (!opts.incremental) {
    this.tree = [];
  }

  // Make the destination folder
  if (this.options.dest) {
    mkdirp(this.options.dest);
  }

  // If `src` was passed, make an ad-hoc stream for processing
  if (this.options.src) {
    return new Promise((resolve, reject) => {
      vfs
        .src(this.options.src, { base: this.options.base })
        .pipe(transform.apply(this))
        .on('finish', resolve)
        .on('error', reject);
    });
  }
  // Otherwise, go straight to the transform function.
  else {
    return transform.apply(this);
  }

  /**
   * Create a stream transform function to manipulate files.
   * @private
   * @returns {Function} Transform function.
   */
  function transform() {
    return through.obj(
      /**
       * Stream transform function. Generates page data from a file and stores it in Spacedoc's page list. This function does not return a modified file to the stream, because the files aren't written until every page has been processed.
       * @private
       * @param {Vinyl} file - File to transform.
       * @param {String} enc - File encoding.
       * @param {Function} cb - Callback to return the modified file.
       */
      (file, enc, cb) => {
        this.parse(file, opts).then(() => cb());
      },
      /**
       * Stream flush function. Iterates through the created page data and renders HTML files for each one.
       * @private
       * @this stream.Transform
       * @param {Function} cb - Callback that signals the function is finished.
       */
      function(cb) {
        _this.tree.map(page => {
          const file = new File({
            path: replaceExt(page.fileName, `.${_this.options.extension}`),
            base: _this.options.pageRoot || process.cwd(),
            contents: new Buffer(_this.build(page)),
          });

          // Write new file to disk if necessary
          if (_this.options.dest) {
            const filePath = path.join(_this.options.dest, path.basename(file.path));
            fs.writeFileSync(filePath, file.contents.toString());
          }

          // Push finished file through stream
          this.push(file);

          // Log page name, processing time, and adapters used to console
          if (!_this.options.silent) {
            statusLog(path.basename(file.path), page);
          }
        });

        cb();
      }
    );
  }
}
