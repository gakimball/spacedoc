#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const Spacedoc = require('../index');

program
  .version('0.2.0')
  .usage('[options]')
  .option('-s, --source <glob>', 'Glob of files to process')
  .option('-t, --template <file>', 'Handlebars template to use')
  .option('-a, --adapters <items>', 'Adapters to use', list)
  .option('-d, --dest <folder>', 'Folder to output HTML to')
  .option('-m, --marked <file>', 'Path to a Marked renderer instance', lib)
  .option('-h, --handlebars <file>', 'Path to a Handlebars instance', lib)
  .parse(process.argv);

Spacedoc.config({
  src: program.source || false,
  template: program.template || false,
  dest: program.dest || false,
  marked: program.marked || false,
  handlebars: program.handlebars || false
});

for (let i in program.adapters) {
  Spacedoc.adapter(program.adapters[i]);
}

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
