const fs = require('fs');
const isEmptyObject = require('is-empty-object');
const mkdirp = require('mkdirp').sync;
const path = require('path');
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
    return vfs
      .src(this.options.src, { base: this.options.base })
      .pipe(transform.apply(this));
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
    /**
     * Stream transform function. Takes in a Vinyl file for a documentation page and makes these changes:
     *   - Parses Front Matter for Spacedoc adapters and collects documentation data
     *   - Converts Markdown to HTML (unless configured to ignore it)
     *   - Changes the extension to `.html` (or whatever was configured)
     *   - Removes Front Matter (unless configured to keep it)
     *   - Replaces the page contents with the loaded template
     *
     * @private
     * @param {Vinyl} file - File to transform.
     * @param {String} enc - File encoding.
     * @param {Function} cb - Callback to return the modified file.
     */
    return through.obj((file, enc, cb) => {
      const time = process.hrtime();

      this.parse(file, opts).then(data => {
        // Change the extension of the incoming file to .html, and replace the Markdown contents with rendered HTML
        const ext = path.extname(file.path);
        const newExt = this.options.extension;

        file.path = file.path.replace(new RegExp(ext+'$'), `.${newExt}`);
        file.contents = new Buffer(this.build(data));

        // Write new file to disk if necessary
        if (this.options.dest) {
          const filePath = path.join(this.options.dest, path.basename(file.path));
          fs.writeFileSync(filePath, file.contents.toString());
        }

        // Log page name, processing time, and adapters used to console
        if (!this.options.silent) {
          statusLog(path.basename(file.path), data, process.hrtime(time));
        }

        cb(null, file);
      });
    });
  };
}
