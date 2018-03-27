const path = require('path');
const globby = require('globby');
const flatten = require('flatten');
const getConfig = require('./lib/get-config');
const parsePage = require('./lib/parse-page');
const parseDocs = require('./lib/parse-docs');

module.exports = opts => {
  const options = getConfig(opts);
  const getPage = parsePage(options);
  const getDoclets = parseDocs(options.adapters);

  return () => {
    const output = {
      pages: [],
      docs: {},
    };

    options.adapters.forEach((adapter, name) => {
      output.docs[name] = [];
    });

    const tasks = [];

    if (options.pages) {
      const pagesGlob = path.join(process.cwd(), options.pages, '**/*.md');
      const parsePages = files => files.forEach(file => {
        output.pages.push(getPage(file));
      });

      tasks.push(globby(pagesGlob).then(parsePages));
    }

    if (options.docs && options.adapters.size > 0) {
      const extensions = flatten([...options.adapters.values()].map(a => a.extensions || []));
      const docsGlob = options.docs.map(pattern =>
        path.join(pattern, `**/*.${extensions.length === 1 ? extensions[0] : `{${extensions.join(',')}`}`)
      );
      const parseDocs = files => Promise.all(files.map(file => {
        return getDoclets(file).then(res => {
          if (res.adapter) {
            output.docs[res.adapter].push(...res.doclets);
          }
        });
      }));

      tasks.push(globby(docsGlob).then(parseDocs));
    }

    return Promise.all(tasks).then(() => output);
  };
};
