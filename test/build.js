const { expect } = require('chai');
const { Spacedoc } = require('..');

const TEST_FILE = require('./fixtures/test_file');

describe('Spacedoc.build()', () => {
  it('builds an HTML file from the data of a page', () => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template-simple.html'
    });

    const output = s.build({ var: 'kitty' });
    expect(output).to.be.a('string');
    expect(output).to.contain('kitty');
  });

  it('adds global data to the Handlebars instance', () => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template-simple.html',
      data: { var: 'kitty' }
    });

    const output = s.build({});
    expect(output).to.contain('kitty');
  });

  it('catches Handlebars errors', () => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template-broken.html'
    });

    expect(() => {
      s.build({})
    }).to.throw(Error);
  });

  it('allows Front Matter to be retained on the page', function(done) {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template.html',
      keepFm: true
    });

    s.parse(TEST_FILE).then(data => {
      const output = s.build(data);
      expect(output).to.contain('---');
      done();
    }).catch(done);
  });

  it('throws an error if no template is defined', done => {
    const s = new Spacedoc();
    s.config({});

    s.parse(TEST_FILE).then(data => {
      expect(() => s.build(data)).to.throw(Error);
      done();
    }).catch(done);
  });
});
