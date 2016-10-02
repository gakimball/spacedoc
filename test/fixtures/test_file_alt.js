var File = require('vinyl');
var fs = require('fs');

module.exports = new File({
  cwd: process.cwd(),
  base: 'test/fixtures',
  path: 'test/fixtures/example-alt-layout.md',
  contents: fs.readFileSync('test/fixtures/example-alt-layout.md')
});
