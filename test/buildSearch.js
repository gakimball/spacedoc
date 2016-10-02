const { expect } = require('chai');
const fs = require('fs');
const rimraf = require('rimraf');
const { Spacedoc } = require('..');

const Adapters = ['test/fixtures/spacedoc-mock'];

describe('Spacedoc.buildSearch()', () => {
  afterEach(done => {
    rimraf('test/fixtures/_build', done);
  });

  it('works even if search was not configured', () => {
    const s = new Spacedoc().config({
      src: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    return s.init().then(() => s.buildSearch('test/fixtures/_build/search.json'));
  });

  it('flags generic pages as "page"', () => {
    const s = new Spacedoc().config({
      src: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    return s.init().then(() => {
      return s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        page = JSON.parse(data)[0];

        expect(page.type).to.equal('page');
      });
    });
  });

  it('flags pages with code hooks as "component"', () => {
    const s = new Spacedoc().config({
      adapters: Adapters,
      src: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    return s.init().then(() => {
      return s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        data = JSON.parse(data);

        for (var i in data) {
          if (data[i].name === 'Button')
            expect(data[i].type).to.equal('component')
        }
      });
    });
  });

  it('allows for custom page types', () => {
    const s = new Spacedoc().config({
      src: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true,
      search: {
        pageTypes: {
          custom: function(item) {
            expect(item).to.be.an('object');
            return true;
          }
        }
      }
    });

    return s.init().then(() => {
      s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        page = JSON.parse(data)[0];

        expect(page.type).to.equal('custom');
      });
    });
  });

  it('creates a JSON file of search results', () => {
    const s = new Spacedoc().config({
      adapters: Adapters,
      src: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    return s.init().then(() => {
      return s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        data = JSON.parse(data);

        expect(data).to.be.an('array');
        expect(data).to.have.length(5);
      });
    });
  });

  it('allows extra external results to be added', () => {
    const s = new Spacedoc().config({
      adapters: Adapters,
      src: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true,
      search: {
        extra: 'test/fixtures/search.yml'
      }
    });

    return s.init().then(() => {
      return s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        data = JSON.parse(data);

        expect(data).to.be.an('array');
        expect(data).to.have.length(5 + 2); // 2 extra results in the YML file
      });
    });
  });

  it('can be called without an outFile if one is defined in the config', () => {
    const s = new Spacedoc().config({
      src: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true,
      search: {
        dest: 'test/fixtures/_build/search.json',
      }
    });

    return s.init().then(() => {
      return s.buildSearch().then(() => {
        expect(fs.existsSync('./test/fixtures/_build/search.json')).to.be.true;
      });
    });
  });

  it('throws an error if called without an outFile, but one is not defined in config', () => {
    const s = new Spacedoc().config({
      src: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true,
    });

    return expect(s.init().then(() => s.buildSearch())).to.be.rejected;
  });
});
