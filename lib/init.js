const fs = require('fs');
const mkdirp = require('mkdirp').sync;
const path = require('path');
const statusLog = require('./util/statusLog');
const through = require('through2');
const vfs = require('vinyl-fs');

module.exports = function(opts = {}) {
  // Reset the internal data tree
  if (!opts.incremental) {
    this.tree = [];
  }

  if (this.options.dest) {
    mkdirp(this.options.dest);
  }

  if (this.options.src) {
    return vfs
      .src(this.options.src, { base: this.options.base })
      .pipe(transform.apply(this));
  }
  else {
    return transform.apply(this);
  }

  function transform() {
    return through.obj((file, enc, cb) => {
      var time = process.hrtime();

      this.parse(file, opts).then(data => {
        // Change the extension of the incoming file to .html, and replace the Markdown contents with rendered HTML
        var ext = path.extname(file.path);
        var newExt = this.options.extension;

        file.path = file.path.replace(new RegExp(ext+'$'), '.' + newExt);
        file.contents = new Buffer(this.build(data));

        // Write new file to disk if necessary
        if (this.options.dest) {
          var filePath = path.join(this.options.dest, path.basename(file.path));
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
