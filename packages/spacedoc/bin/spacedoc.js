#!/usr/bin/env node

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

Spacedoc.config(cli.flags.config).init()
  .then(() => {
    if (Spacedoc._instance.options.search.output) {
      return Spacedoc.buildSearch();
    }
  })
  .catch(err => {
    throw new Error(err);
  });

Spacedoc.build({ watch: cli.flags.watch }).catch(err => {
  console.log(err);
});
