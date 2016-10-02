#!/usr/bin/env node

const meow = require('meow');
const Spacedoc = require('..');

const cli = meow(`
  Usage
    $ spacedoc

  Options
    -c, --config  Path to config file
`, {
  alias: {
    c: 'config',
  }
});

Spacedoc.config(cli.flags.config).init()
  .then(() => {
    if (Spacedoc._instance.options.search.dest) {
      return Spacedoc.buildSearch();
    }
  })
  .catch(err => {
    throw new Error(err);
  });
