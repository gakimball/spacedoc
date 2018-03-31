#!/usr/bin/env node

const fs = require('fs');
const meow = require('meow');
const spacedoc = require('..');

const cli = meow(`
  Usage
    $ spacedoc

  Options
    -c, --config  Path to config file
    -w, --watch   Watch files for changes
`, {
  alias: {
    c: 'config',
    w: 'watch'
  }
});

spacedoc.config(cli.flags.config);

spacedoc({watch: cli.flags.watch}, () => {
  if (spacedoc._instance.options.search.output) {
    spacedoc.buildSearch();
  }

  if (spacedoc._instance.options.debug) {
    fs.writeFileSync('debug.json', JSON.stringify(spacedoc.tree, null, '  '));
  }
});

spacedoc.build({watch: cli.flags.watch}).catch(err => {
  console.log(err);
});
