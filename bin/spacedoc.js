#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const { Spacedoc } = require('../index');

program
  .version('0.2.0')
  .usage('[options]')
  .option('-s, --source <glob>', 'Glob of files to process')
  .option('-t, --template <file>', 'Pug template to use')
  .option('-a, --adapters <items>', 'Adapters to use', list)
  .option('-d, --dest <folder>', 'Folder to output HTML to')
  .option('-m, --marked <file>', 'Path to a Marked renderer instance', lib)
  .parse(process.argv);

Spacedoc.config({
  src: program.source || false,
  template: program.template || false,
  dest: program.dest || false,
  marked: program.marked || false,
  adapters: program.adapters || []
});

Spacedoc.init().on('finish', process.exit);

// Creates an array from a comma-separated list
function list(val) {
  return val.split(',');
}

// Returns a require'd library from a path
function lib(val) {
  const p = path.join(process.cwd(), val);
  return require(p);
}
