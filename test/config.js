const { expect } = require('chai');
const { Spacedoc } = require('..');

describe('Spacedoc.config()', () => {
  it('sets configuration settings', () => {
    var s = new Spacedoc();
    s = s.config({
      src: 'src',
      dest: 'dest'
    }).adapter('sass').adapter('js');

    expect(s).to.be.an.instanceOf(Spacedoc);
    expect(s.options.src).to.equal('src');
    expect(s.options.dest).to.equal('dest');
  });

  it('loads an HTML template', () => {
    var s = new Spacedoc();
    s = s.config({
      src: 'src',
      dest: 'dest',
      template: 'test/fixtures/template.html'
    }).adapter('sass').adapter('js');

    expect(s.template).to.be.a('function');
  });

  it('allows a pre-made template function to be used', () => {
    var s = new Spacedoc();
    s = s.config({
      template: () => 'test'
    });

    expect(s.template()).to.equal('test');
  });

  it('loads JSON data from search config', () => {
    var s = new Spacedoc();
    s.config({
      search: { extra: 'test/fixtures/search.json' }
    });

    expect(s.options.search.extra).to.be.an('array');
    expect(s.options.search.extra).to.have.length(2);
  });

  it('loads YAML data from search config', () => {
    var s = new Spacedoc();
    s.config({
      search: { extra: 'test/fixtures/search.yml' }
    });

    expect(s.options.search.extra).to.be.an('array');
    expect(s.options.search.extra).to.have.length(2);
  });
});
