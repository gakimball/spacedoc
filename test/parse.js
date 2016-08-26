const { expect } = require('chai');
const Spacedoc = require('..').Spacedoc;

const TEST_FILE = require('./fixtures/test_file');
const TEST_FILE_HTML = require('./fixtures/test_file_html');

describe('Spacedoc.parse()', () => {
  it('converts Markdown into HTML', done => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template.pug'
    });

    s.parse(TEST_FILE, {}).then(data => {
      expect(data).to.be.an('object');
      expect(data.body).to.contain('<h2');
      done();
    });
  });

  it('does not touch Markdown if configured to ignore it', done => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template.pug',
      marked: null
    });

    s.parse(TEST_FILE).then(data => {
      expect(data).to.be.an('object');
      expect(data.body).to.not.contain('<h2');
      done();
    });
  });

  it('only compiles files ending in .md', done => {
    const s = new Spacedoc();
    s.config({});

    s.parse(TEST_FILE_HTML).then(data => {
      expect(data).to.be.an('object');
      expect(data.body).to.contain('## Heading');
      done();
    }).catch(done);
  });

  it('loads data from adapters', done => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template.pug',
      marked: null
    }).adapter('test/fixtures/spacedoc-mock');

    s.parse(TEST_FILE).then(data => {
      expect(data.docs.mock).to.be.an('object');
      done();
    }).catch(done);
  });

  it('catches Markdown errors', done => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template.pug',
      marked: require('./fixtures/marked-broken')
    });

    s.parse(TEST_FILE).catch(e => {
      expect(e).to.be.an.instanceOf(Error);
      done();
    });
  });

  it('can load files from a string', done => {
    const s = new Spacedoc();
    s.config();

    s.parse('test/fixtures/example.md').then(data => {
      expect(data.title).to.equal('Test');
      done();
    }).catch(done);
  });

  it('throws an error if a file path is not found', done => {
    const s = new Spacedoc();
    s.config();

    s.parse('test/fixtures/nope.md').catch(err => {
      expect(err).to.be.an.instanceOf(Error);
      done();
    });
  });
});
