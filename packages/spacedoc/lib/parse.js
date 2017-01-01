const File = require('vinyl');
const frontMatter = require('front-matter');
const fs = require('fs');
const hljs = require('highlight.js');
const path = require('path');
const getPageFileName = require('./util/getPageFileName');
const getPageOrder = require('./util/getPageOrder');
const pug = require('pug');
const replaceBase = require('replace-basename');
const replaceExt = require('replace-ext');
const transformLinks = require('transform-markdown-links');
const yamlComment = require('./util/yamlComment');

/**
 * Parses a single documentation page, collecting the needed documentation data based on the settings in the page's Front Matter. The file is not modified in the process.
 * @param {(Vinyl|String)} file - File to parse, or a path to a file to parse.
 * @returns {Promise.<PageData>} Promise containing a page object.
 * @todo Make file I/O asynchronous.
 */
module.exports = function parse(file) {
  // If a string path is passed instead of a Vinyl file, create a new file from the string
  if (typeof file === 'string') {
    try {
      file = new File({
        path: file,
        contents: fs.readFileSync(file),
      });
    }
    catch (e) {
      return new Promise((resolve, reject) => reject(new Error(`Spacedoc.parse(): error loading file ${file}`)));
    }
  }

  // Don't process directories
  if (file.isDirectory()) return Promise.resolve();

  const extension = path.extname(file.path);
  const contents = yamlComment(file.contents.toString(), extension);
  const pageData = frontMatter(contents, extension);

  /**
   * Data representation of a page. This object can be passed to `Spacedoc.build()` to render a full documentation page.
   * @typedef {Object} PageData
   * @prop {String} body - The main body of the page. This includes everything other than the Front Matter at the top. It's usually Markdown or HTML.
   * @prop {Object.<String, Object>} docs - Documentation data. Each key is the name of an adapter, such as `sass` or `js`, and each value is the data that adapter found.
   * @prop {String} fileName - Final path to the page, relative to the root page, which is defined by `options.pageRoot`.
   * @prop {String} group - Group the page is in.
   * @prop {?String} layout - Template layout to use. `default` is set if a page doesn't define this.
   * @prop {Object} meta - Original Front Matter included in the page.
   * @prop {?Number} order - Order of page within navigation.
   * @prop {String} originalName - Path to the page as originally given to the parser.
   * @prop {String} title - Page title.
   */
  const page = {
    body: '',
    docs: {},
    fileName: getPageFileName(file.path, this.options.pageRoot, this.options.extension),
    group: pageData.attributes.group || null,
    meta: pageData.attributes,
    order: getPageOrder(file.path),
    originalName: file.path,
    title: pageData.attributes.title,
  };

  // If there's no title...
  if (!page.title) {
    // ...try to pull it from an `<h1>` in the Markdown...
    if (path.extname(page.originalName) === '.md') {
      const match = pageData.body.match(/^# (.+)$/m);

      if (match) {
        page.title = match[1];
        // And remove it from the original Markdown so we don't get two titles
        pageData.body = pageData.body.replace(match[0], '');
      }
    }
    // ...or just use the page's filename
    else {
      page.title = path.basename(page.fileName, path.extname(page.fileName));
    }
  }

  // Render as Markdown for .md files
  if (this.options.markdown && path.extname(page.originalName) === '.md') {
    try {
      // Replace links to `.md` files with `.html`
      const markdown = transformLinks(pageData.body, link => {
        if (path.extname(link) === '.md') {
          return replaceExt(link, '.html');
        }
      });
      page.body = this.options.markdown.render(markdown);
      page.fileName = replaceExt(page.fileName, '.html');
    }
    catch (e) {
      return Promise.reject(new Error(`Markdown error: ${e.message}`));
    }
  }
  // Render as Pug for .pug files
  else if (path.extname(page.originalName) === '.pug') {
    page.body = pug.render(pageData.body);
    page.fileName = replaceExt(page.fileName, '.html');
  }
  // Everything else keep as-is
  else {
    page.body = pageData.body;
  }

  // When all adapter data has been collected, add it to the page object
  return this.parseDocs(page.meta.docs).then(results => {
    for (let res of results) {
      page.docs[res.adapter] = res.data;
    }

    return page;
  }).catch(err => {
    console.log(err);
  });
}
