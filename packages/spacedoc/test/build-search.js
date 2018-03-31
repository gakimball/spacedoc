const {expect} = require('chai');
const fs = require('fs');
const rimraf = require('rimraf');
const {Spacedoc} = require('..');

const Adapters = ['test/fixtures/spacedoc-mock'];

describe('Spacedoc.buildSearch()', () => {
  afterEach(done => {
    rimraf('test/fixtures/_build', done);
  });

  it('works even if search was not configured', () => {
    const s = new Spacedoc().config({
      input: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    return s.init().then(() => s.buildSearch('test/fixtures/_build/search.json'));
  });

  it('flags pages as "page"', () => {
    const s = new Spacedoc().config({
      input: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    return s.init().then(() => s.buildSearch('test/fixtures/_build/search.json')).then(() => {
      const data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
      const page = JSON.parse(data)[0];

      expect(page.type).to.equal('page');
    });
  });

  it('allows for custom page types', () => {
    const s = new Spacedoc().config({
      input: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true,
      search: {
        pageTypes: {
          custom(item) {
            expect(item).to.be.an('object');
            return true;
          }
        }
      }
    });

    return s.init().then(() => s.buildSearch('test/fixtures/_build/search.json')).then(() => {
      const data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
      const page = JSON.parse(data)[0];

      expect(page.type).to.equal('custom');
    });
  });

  it('creates a JSON file of search results', () => {
    const s = new Spacedoc().config({
      adapters: Adapters,
      input: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    return s.init().then(() => s.buildSearch('test/fixtures/_build/search.json')).then(() => {
      let data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
      data = JSON.parse(data);

      expect(data).to.be.an('array');
      expect(data).to.have.length(2); // 1 page + 1 doclet
    });
  });

  it('allows extra external results to be added', () => {
    const s = new Spacedoc().config({
      adapters: Adapters,
      input: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true,
      search: {
        extra: 'test/fixtures/search.yml'
      }
    });

    return s.init().then(() => s.buildSearch('test/fixtures/_build/search.json')).then(() => {
      let data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
      data = JSON.parse(data);

      expect(data).to.be.an('array');
      expect(data).to.have.length(2 + 2); // 2 extra results in the YML file
    });
  });

  it('can be called without an outFile if one is defined in the config', () => {
    const s = new Spacedoc().config({
      input: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true,
      search: {
        output: 'test/fixtures/_build/search.json'
      }
    });

    return s.init().then(() => s.buildSearch('test/fixtures/_build/search.json')).then(() => {
      expect(fs.existsSync('./test/fixtures/_build/search.json')).to.equal(true);
    });
  });

  it('throws an error if called without an outFile, but one is not defined in config', () => {
    const s = new Spacedoc().config({
      input: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    return expect(s.init().then(() => s.buildSearch())).to.be.rejected;
  });
});
