const { expect } = require('chai');
const sinon = require('sinon');
const { Spacedoc } = require('..');
const mockVinyl = require('./util/mockVinyl');

const TEST_FILE = mockVinyl('test/fixtures/example.md');
const TEST_FILE_ALT = mockVinyl('test/fixtures/example-alt-layout.md');
const TEST_FILE_MISSING = mockVinyl('test/fixtures/example-missing-layout.md');

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
      template: 'test/fixtures/template-global.pug',
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

      expect(console.warn).to.have.been.calledOnce;
    });

    it('catches an undefined layout being set', () => {
      const s = new Spacedoc();
      s.config({
        template: 'test/fixtures/template',
      });

      return s.parse(TEST_FILE_MISSING).then(data => {
        s.build(data);
        expect(console.warn).to.have.been.calledOnce;
      });
    });

    it('catches alternate layouts being defined in a single-template setup', () => {
      const s = new Spacedoc();
      s.config({
        template: () => '',
      });

      return s.parse(TEST_FILE_ALT).then(data => {
        s.build(data);
        expect(console.warn).to.have.been.calledOnce;
      });
    });
  });

  it('allows Front Matter to be retained on the page', () => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template.pug',
      keepFm: true
    });

    return expect(s.parse(TEST_FILE).then(data => s.build(data))).to.eventually.contain('---');
  });

  it('allows an alternate layout to be used', () => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template',
    });

    return expect(s.parse(TEST_FILE_ALT).then(data => s.build(data))).to.eventually.contain('So alt');
  });
});
