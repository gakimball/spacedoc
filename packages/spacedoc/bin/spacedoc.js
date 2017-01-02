#!/usr/bin/env node

const fs = require('fs');
const meow = require('meow');
const Spacedoc = require('..');

const cli = meow(`
  Usage
    $ spacedoc

  Options
    -c, --config  Path to config file
    -w, --watch   Watch files for changes
`, {
  alias: {
    c: 'config',
    w: 'watch',
  },
});

Spacedoc.config(cli.flags.config);

Spacedoc({ watch: cli.flags.watch }, err => {
  if (Spacedoc._instance.options.search.output) {
    Spacedoc.buildSearch();
  }

  if (Spacedoc._instance.options.debug) {
    fs.writeFileSync('debug.json', JSON.stringify(Spacedoc.tree, null, '  '));
  }
});

Spacedoc.build({ watch: cli.flags.watch }).catch(err => {
  console.log(err);
});
