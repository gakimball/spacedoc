const fs = require('fs');
const path = require('path');
const File = require('vinyl');
const isEmptyObject = require('is-empty-object');
const mkdirp = require('mkdirp').sync;
const through = require('through2');
const vfs = require('vinyl-fs');
const statusLog = require('./util/status-log');

/**
 * Initialize Spacedoc, parsing a set of documentation pages and outputting HTML files.
 * This function can be called standalone, with the `input` and `output` options having been set in `Spacedoc.config()`, or it can be called in a Gulp stream, and `input` and `output` can be omitted.
 *
 * @example <caption>Use within a Gulp stream:</caption>
 *   gulp.src('docs/*.md')
 *     .pipe(Spacedoc.init())
 *     .pipe(gulp.dest('dist'));
 *
 * @example <caption>Use standalone:</caption>
 *   Spacedoc.init({
 *     input: 'docs/*.md',
 *     output: 'dist'
 *   })
 *     .on('finish', () => {)
 *       // Parsing finished
 *     });
 *
 * @returns {(Stream.Writable.<Vinyl>|Promise)} If called without `input`, returns a stream containing the modified files. You can add `on('finish')` after `Spacedoc.init()` to listen for when processing is done. If called with `input`, returns a Promise which resolves when all parsing and writing is finished, or rejects if there's an error.
 * @todo Remove synchronous file I/O
 */
module.exports = function () {
  // Initialize options if Spacedoc.config() was not called
  if (isEmptyObject(this.options)) {
    this.config();
  }

  // Necessary because through2's end stream function below can't be an arrow function
  const _this = this;

  // Reset the internal data tree
  this.tree = [];

  // Make the destination folder
  if (this.options.output) {
    mkdirp(this.options.output);
  }

  // If `input` was passed, make an ad-hoc stream for processing
  if (this.options.input) {
    return new Promise((resolve, reject) => {
      vfs
        .src(this.options.input, {base: this.options.pageRoot})
        .pipe(transform.apply(this))
        .on('finish', resolve)
        .on('error', reject);
    });
  }
  // Otherwise, go straight to the transform function.

  return transform.apply(this);

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
        this.parse(file).then(page => {
          if (page) {
            this.tree.push(page);
          }

          cb();
        }).catch(err => console.log(err));
      },

      /**
       * Stream flush function. Iterates through the created page data and renders HTML files for each one.
       * @private
       * @this stream.Transform
       * @param {Function} cb - Callback that signals the function is finished.
       */
      function (cb) {
        const tasks = _this.tree.map(page => new Promise((resolve, reject) => {
          const file = new File({
            path: page.fileName,
            base: _this.options.pageRoot,
            contents: Buffer.from(_this.build(page))
          });

          // Write new file to disk if necessary
          if (_this.options.output) {
            const filePath = path.join(_this.options.output, file.path);

            // Create parent directory
            mkdirp(path.dirname(filePath));

            // Then write file
            fs.writeFile(filePath, file.contents.toString(), err => {
              if (err) {
                reject(err);
              } else {
                finish.apply(this);
              }
            });
          } else {
            finish.apply(this);
          }

          function finish() {
            // Push finished file through stream
            this.push(file);

            // Log page name, processing time, and adapters used to console
            if (!_this.options.silent) {
              statusLog(path.relative(_this.options.pageRoot, page.originalName), page);
            }

            resolve();
          }
        }));

        Promise.all(tasks)
          .then(() => cb())
          .catch(err => console.log(err));
      }
    );
  }
};
