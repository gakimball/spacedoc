const { expect } = require('chai');
const Spacedoc = require('..').Spacedoc;
const mockVinyl = require('./util/mockVinyl');

const TEST_FILE = mockVinyl('test/fixtures/example.md');
const TEST_FILE_HTML = mockVinyl('test/fixtures/example.html');

describe('Spacedoc.parse()', () => {
  it('converts Markdown into HTML', () => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template.pug'
    });

    return expect(s.parse(TEST_FILE))
      .to.eventually.be.an('object')
      .with.property('body').that.contain('<h2');
  });

  it('does not touch Markdown if configured to ignore it', () => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template.pug',
      marked: null
    });

    return expect(s.parse(TEST_FILE))
      .to.eventually.have.property('body')
      .that.not.contain('<h2');
  });

  it('only compiles files ending in .md', () => {
    const s = new Spacedoc();

    return expect(s.parse(TEST_FILE_HTML))
      .to.eventually.have.property('body')
      .that.contain('## Heading');
  });

  it('loads data from adapters', () => {
    const s = new Spacedoc();
    s.config({
      adapters: ['test/fixtures/spacedoc-mock'],
      template: 'test/fixtures/template.pug',
      marked: null
    });

    return expect(s.parse(TEST_FILE))
      .to.eventually.have.deep.property('docs.mock')
      .that.is.an('array');
  });

  it('catches Markdown errors', () => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template.pug',
      marked: require('./fixtures/marked-broken')
    });

    return expect(s.parse(TEST_FILE)).to.be.rejected;
  });

  it('can load files from a string', () => {
    const s = new Spacedoc();

    return expect(s.parse('test/fixtures/example.md'))
      .to.eventually.have.property('title', 'Test');
  });

  it('throws an error if a file path is not found', () => {
    const s = new Spacedoc();

    return expect(s.parse('test/fixtures/nope.md')).to.be.rejected;
  });
});
