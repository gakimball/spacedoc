const { expect } = require('chai');
const sinon = require('sinon');
const { Spacedoc } = require('..');

const TEST_FILE = require('./fixtures/test_file');
const TEST_FILE_ALT = require('./fixtures/test_file_alt');
const TEST_FILE_MISSING = require('./fixtures/test_file_missing_layout');

describe('Spacedoc.build()', () => {
  it('builds an HTML file from the data of a page', () => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template-simple.pug'
    });

    const output = s.build({ kitty: 'kitty' });
    expect(output).to.be.a('string');
    expect(output).to.contain('kitty');
  });

  it('adds global data to the template context', () => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template-simple.pug',
      data: { kitty: 'kitty' }
    });

    const output = s.build();
    expect(output).to.contain('kitty');
  });

  describe('template errors', () => {
    beforeEach(() => sinon.stub(console, 'warn'));
    afterEach(() => console.warn.restore());

    it('catches template errors', () => {
      const s = new Spacedoc();
      s.config({
        template: 'test/fixtures/template-broken.pug'
      });
      s.build();

      expect(console.warn.calledOnce).to.be.true;
    });

    it('catches an undefined layout being set', () => {
      const s = new Spacedoc();
      s.config({
        template: 'test/fixtures/template',
      });

      return s.parse(TEST_FILE_MISSING).then(data => {
        s.build(data);
        expect(console.warn.calledOnce).to.be.true;
      });
    });

    it('catches alternate layouts being defined in a single-template setup', () => {
      const s = new Spacedoc();
      s.config({
        template: () => '',
      });

      return s.parse(TEST_FILE_ALT).then(data => {
        s.build(data);
        expect(console.warn.calledOnce).to.be.true;
      });
    });
  });

  it('allows Front Matter to be retained on the page', function(done) {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template.pug',
      keepFm: true
    });

    s.parse(TEST_FILE).then(data => {
      const output = s.build(data);
      expect(output).to.contain('---');
      done();
    }).catch(done);
  });

  it('allows an alternate layout to be used', () => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template',
    });

    return s.parse(TEST_FILE_ALT).then(data => s.build(data)).then(output => {
      expect(output).to.contain('So alt');
    });
  });
});
