const { expect } = require('chai');
const { Spacedoc } = require('..');

describe('Spacedoc.config()', () => {
  it('sets configuration settings', () => {
    let s = new Spacedoc();
    s = s.config({
      src: 'src',
      dest: 'dest'
    });

    expect(s).to.be.an.instanceOf(Spacedoc);
    expect(s.options.src).to.equal('src');
    expect(s.options.dest).to.equal('dest');
  });

  it('loads from a specific file', () => {
    const s = new Spacedoc();
    s.config('test/fixtures/mock-project/spacedoc.yml');

    expect(s.options.adapters).to.eql(['mock']);
  });

  describe('automatic config loading', () => {
    let oldDir;
    before(() => {
      oldDir = process.cwd();
      process.chdir('./test/fixtures/mock-project');
    });
    after(() => process.chdir(oldDir));

    it('tries to load a spacedoc.yml in the current directory', () => {
      const s = new Spacedoc();
      s.config();

      expect(s.options.adapters).to.eql(['mock']);
    });
  });

  it('loads adapters', () => {
    const s = new Spacedoc();
    s.config({ adapters: ['test/fixtures/spacedoc-mock'] });

    expect(s.adapters.mock).to.be.a('function');
  });

  it('loads the default template', () => {
    let s = new Spacedoc();
    s = s.config();

    expect(s.template).to.be.a('function');
  });

  it('loads an HTML template', () => {
    let s = new Spacedoc();
    s = s.config({
      src: 'src',
      dest: 'dest',
      template: 'test/fixtures/template.pug'
    });

    expect(s.template).to.be.a('function');
  });

  it('allows a pre-made template function to be used', () => {
    const s = new Spacedoc();
    s.config({
      template: () => 'test'
    });

    expect(s.template()).to.equal('test');
  });

  it('loads JSON data from search config', () => {
    const s = new Spacedoc();
    s.config({
      search: { extra: 'test/fixtures/search.json' }
    });

    expect(s.options.search.extra).to.be.an('array');
    expect(s.options.search.extra).to.have.length(2);
  });

  it('loads YAML data from search config', () => {
    const s = new Spacedoc();
    s.config({
      search: { extra: 'test/fixtures/search.yml' }
    });

    expect(s.options.search.extra).to.be.an('array');
    expect(s.options.search.extra).to.have.length(2);
  });
});
