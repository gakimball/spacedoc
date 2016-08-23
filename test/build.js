const { expect } = require('chai');
const { Supercollider } = require('..');

var TEST_FILE = require('./fixtures/test_file');

describe('Supercollider.build()', () => {
  it('builds an HTML file from the data of a page', () => {
    var s = new Supercollider();
    s.config({
      template: 'test/fixtures/template-simple.html'
    });

    var output = s.build({ var: 'kitty' });
    expect(output).to.be.a('string');
    expect(output).to.contain('kitty');
  });

  it('adds global data to the Handlebars instance', () => {
    var s = new Supercollider();
    s.config({
      template: 'test/fixtures/template-simple.html',
      data: { var: 'kitty' }
    });

    var output = s.build({});
    expect(output).to.contain('kitty');
  });

  it('catches Handlebars errors', () => {
    var s = new Supercollider();
    s.config({
      template: 'test/fixtures/template-broken.html'
    });

    expect(() => {
      s.build({})
    }).to.throw(Error);
  });

  it('allows Front Matter to be retained on the page', function(done) {
    var s = new Supercollider();
    s.config({
      template: 'test/fixtures/template.html',
      keepFm: true
    });

    s.parse(TEST_FILE).then(data => {
      var output = s.build(data);
      expect(output).to.contain('---');
      done();
    }).catch(done);
  });
});
