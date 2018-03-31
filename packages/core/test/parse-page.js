const path = require('path');
const {expect} = require('chai');
const parsePage = require('../lib/parse-page');

describe('parsePage()', () => {
  let getPage;

  before(() => {
    getPage = parsePage({
      pages: 'test/fixtures'
    });
  });

  it('returns a page object', () => {
    const filePath = path.join(__dirname, 'fixtures/file.md');

    expect(getPage(filePath)).to.eql({
      body: 'Kittens!\n',
      path: 'file',
      meta: {},
      order: null,
      title: 'file'
    });
  });

  it('assigns a page order if the filename has a leading number', () => {
    const filePath = path.join(__dirname, 'fixtures/01-file.md');

    expect(getPage(filePath)).to.have.property('order', 1);
  });

  it('removes the leading number from a file', () => {
    const filePath = path.join(__dirname, 'fixtures/01-file.md');

    expect(getPage(filePath)).to.have.property('path', 'file');
  });

  it('pulls a title from a Markdown H1', () => {
    const filePath = path.join(__dirname, 'fixtures/file-md-title.md');

    expect(getPage(filePath)).to.have.property('title', 'Kittens');
  });

  it('pulls a title from Front Matter', () => {
    const filePath = path.join(__dirname, 'fixtures/file-frontmatter.md');

    expect(getPage(filePath)).to.have.property('title', 'Kittens');
  });
});
