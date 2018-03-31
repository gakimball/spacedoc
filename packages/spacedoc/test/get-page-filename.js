const {expect} = require('chai');
const getPageFileName = require('../lib/util/get-page-filename');

describe('get-page-filename', () => {
  it('changes the extension to .html', () => {
    expect(getPageFileName('path/to/doggos.pug')).to.equal('path/to/doggos.html');
  });

  it('strips the leading number from a file path', () => {
    expect(getPageFileName('path/to/01-puppers.pug')).to.equal('path/to/puppers.html');
  });

  it('can create a relative path from a root', () => {
    expect(getPageFileName('path/to/yappers.pug', 'path')).to.equal('to/yappers.html');
  });

  it('renames readme.md to index.html', () => {
    expect(getPageFileName('path/to/readme.md')).to.equal('path/to/index.html');
  });
});
