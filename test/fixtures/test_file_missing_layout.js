var File = require('vinyl');
var fs = require('fs');

module.exports = new File({
  cwd: process.cwd(),
  base: 'test/fixtures',
  path: 'test/fixtures/example-missing-layout.md',
  contents: fs.readFileSync('test/fixtures/example-missing-layout.md')
});
