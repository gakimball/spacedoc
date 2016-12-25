const { expect } = require('chai');
const getPageFileName = require('../lib/util/getPageFileName');

describe('getPageFileName', () => {
  it('strips the leading number from a file path', () => {
    expect(getPageFileName('path/to/01-puppers.pug')).to.equal('path/to/puppers.pug');
  });

  it('keeps normal filenames the same', () => {
    expect(getPageFileName('path/to/doggos.pug')).to.equal('path/to/doggos.pug');
  });

  it('can create a relative path from a root', () => {
    expect(getPageFileName('path/to/yappers.pug', 'path')).to.equal('to/yappers.pug');
  });

  it('can replace the extension', () => {
    expect(getPageFileName('path/to/woofers.pug', '', 'html')).to.equal('path/to/woofers.html');
  });

  it('renames readme.md to index.md', () => {
    expect(getPageFileName('path/to/readme.md')).to.equal('path/to/index.md');
  });
});
