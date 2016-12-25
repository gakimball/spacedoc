const { expect } = require('chai');
const { Spacedoc } = require('..');
const Theme = require('portatheme');

describe('Spacedoc.config()', () => {
  it('sets configuration settings', () => {
    let s = new Spacedoc().config({
      input: 'src',
      output: 'dest'
    });

    expect(s).to.be.an.instanceOf(Spacedoc);
    expect(s.options.input).to.equal('src');
    expect(s.options.output).to.equal('dest');
  });

  it('loads from a specific file', () => {
    const s = new Spacedoc().config('test/fixtures/mock-project/spacedoc.yml');

    expect(s.options.input).to.equal('./*.md');
  });

  describe('automatic config loading', () => {
    let oldDir;
    before(() => {
      oldDir = process.cwd();
      process.chdir('./test/fixtures/mock-project');
    });
    after(() => process.chdir(oldDir));

    it('tries to load a spacedoc.yml in the current directory', () => {
      const s = new Spacedoc().config();

      expect(s.options.input).to.equal('./*.md');
    });
  });

  it('loads adapters', () => {
    const s = new Spacedoc().config({
      adapters: ['test/fixtures/spacedoc-mock']
    });

    expect(s.adapters.mock).to.be.a('function');
  });

  it('loads the theme', () => {
    const s = new Spacedoc().config();

    expect(s.theme).to.be.an.instanceOf(Theme);
  });

  it('loads JSON data from search config', () => {
    const s = new Spacedoc().config({
      search: { extra: 'test/fixtures/search.json' }
    });

    expect(s.options.search.extra).to.be.an('array');
    expect(s.options.search.extra).to.have.length(2);
  });

  it('loads YAML data from search config', () => {
    const s = new Spacedoc().config({
      search: { extra: 'test/fixtures/search.yml' }
    });

    expect(s.options.search.extra).to.be.an('array');
    expect(s.options.search.extra).to.have.length(2);
  });
});
