const { expect } = require('chai');
const Spacedoc = require('..').Spacedoc;

const TEST_FILE = require('./fixtures/test_file');

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

  it('loads data from adapters', done => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template.pug',
      marked: null
    }).adapter('sass').adapter('js');

    s.parse(TEST_FILE).then(data => {
      expect(data.docs.sass).to.be.an('object');
      expect(data.docs.js).to.be.an('object');
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
});
