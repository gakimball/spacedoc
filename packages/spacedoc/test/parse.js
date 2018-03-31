const {expect} = require('chai');
const Spacedoc = require('..').Spacedoc;
const mockVinyl = require('./util/mock-vinyl');

const TEST_FILE = mockVinyl('test/fixtures/example.md');
const TEST_FILE_HTML = mockVinyl('test/fixtures/example.html');

describe('Spacedoc.parse()', () => {
  it('converts Markdown into HTML', () => {
    const s = new Spacedoc().config({
      template: 'test/fixtures/template.pug'
    });

    return expect(s.parse(TEST_FILE))
      .to.eventually.be.an('object')
      .with.property('body').that.contain('<h2');
  });

  it('only compiles files ending in .md', () => {
    const s = new Spacedoc().config();

    return expect(s.parse(TEST_FILE_HTML))
      .to.eventually.have.property('body')
      .that.contain('## Heading');
  });

  it('converts Pug files to HTML', () => {
    const s = new Spacedoc().config();

    return expect(s.parse('test/fixtures/example.pug'))
      .to.eventually.have.property('body')
      .that.contain('<p>This');
  });

  it('loads data from adapters', () => {
    const s = new Spacedoc().config({
      adapters: ['test/fixtures/spacedoc-mock'],
      template: 'test/fixtures/template.pug'
    });

    return expect(s.parse(TEST_FILE))
      .to.eventually.have.deep.property('docs.mock')
      .that.is.an('array');
  });

  it('catches Markdown errors', () => {
    const s = new Spacedoc().config({
      template: 'test/fixtures/template.pug',
      markdown: require('./fixtures/markdown-broken')
    });

    return expect(s.parse(TEST_FILE)).to.be.rejected;
  });

  it('can load files from a string', () => {
    const s = new Spacedoc().config();

    return expect(s.parse('test/fixtures/example.md'))
      .to.eventually.have.property('title', 'Test');
  });

  it('throws an error if a file path is not found', () => {
    const s = new Spacedoc().config();

    return expect(s.parse('test/fixtures/nope.md')).to.be.rejected;
  });

  it('renames readme.md to index.html', () => {
    const s = new Spacedoc().config();

    return expect(s.parse('test/fixtures/readme/readme.md'))
      .to.eventually.have.property('fileName')
      .that.contain('index.html');
  });

  it('pulls the title of the page from the Markdown h1', () => {
    const s = new Spacedoc().config();

    return expect(s.parse('test/fixtures/example-no-title.md'))
      .to.eventually.have.property('title', 'Title');
  });

  it('removes the <h1> from Markdown if transferred to page attributes', () => {
    const s = new Spacedoc().config();

    return expect(s.parse('test/fixtures/example-no-title.md'))
      .to.eventually.have.property('body')
      .that.not.contain('<h1');
  });

  it('converts links to .md files to .html', () => {
    const s = new Spacedoc().config();

    return expect(s.parse('test/fixtures/example-link.md'))
      .to.eventually.have.property('body')
      .that.contain('href="filename.html"');
  });

  it('uses the filename as a title if necessary', () => {
    const s = new Spacedoc().config();

    return expect(s.parse('test/fixtures/example-no-title.html'))
      .to.eventually.have.property('title', 'example-no-title');
  });

  it('processes Front Matter in HTML comments', () => {
    const s = new Spacedoc().config();

    return expect(s.parse('test/fixtures/example-front-matter.html'))
      .to.eventually.have.property('title', 'Page Title');
  });

  it('processes Front Matter in Pug comments', () => {
    const s = new Spacedoc().config();

    return expect(s.parse('test/fixtures/example-front-matter.pug'))
      .to.eventually.have.property('title', 'Page Title');
  });

  it('assigns an order to a page', () => {
    const s = new Spacedoc().config();

    return expect(s.parse('test/fixtures/01-example.md'))
      .to.eventually.have.property('order', 1);
  });

  it('sets order to null for normal pages', () => {
    const s = new Spacedoc().config();

    return expect(s.parse('test/fixtures/example.md'))
      .to.eventually.have.property('order', null);
  });
});
