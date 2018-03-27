const path = require('path');

module.exports = (adapters = new Map()) => filePath => {
  let adapter;
  const extension = path.extname(filePath).replace(/^\./, '');

  // Find the right adapter to use
  for (const a of adapters.values()) {
    if (a.extensions.includes(extension)) {
      adapter = a;
      break;
    }
  }

  if (!adapter) {
    return Promise.resolve({
      adapter: null,
      doclets: [],
    });
  }

  // Run the adapter
  return adapter.parse(filePath, adapter.config).then(doclets => ({
    adapter: adapter.name,
    doclets,
  }));
};
