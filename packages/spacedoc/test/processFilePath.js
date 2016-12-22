const { expect } = require('chai');
const processFilePath = require('../lib/util/processFilePath');

describe('processFilePath', () => {
  it('strips the leading number from a file path', () => {
    expect(processFilePath('path/to/01-puppers.pug')).to.equal('path/to/puppers.pug');
  });

  it('keeps normal filenames the same', () => {
    expect(processFilePath('path/to/doggos.pug')).to.equal('path/to/doggos.pug');
  });

  it('can create a relative path from a root', () => {
    expect(processFilePath('path/to/yappers.pug', 'path')).to.equal('to/yappers.pug');
  });

  it('can replace the extension', () => {
    expect(processFilePath('path/to/woofers.pug', '', 'html')).to.equal('path/to/woofers.html');
  });

  it('renames readme.md to index.md', () => {
    expect(processFilePath('path/to/readme.md')).to.equal('path/to/index.md');
  });
});
