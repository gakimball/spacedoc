const { expect } = require('chai');
const fs = require('fs');
const rimraf = require('rimraf');
const { Spacedoc } = require('..');

describe('Spacedoc.buildSearch()', () => {
  afterEach(done => {
    rimraf('test/fixtures/_build', done);
  });

  it('works even if search was not configured', done => {
    const s = new Spacedoc().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    });

    s.init().on('finish', () => {
      s.buildSearch('test/fixtures/_build/search.json').then(done).catch(done);
    });
  });

  it('flags generic pages as "page"', done => {
    const s = new Spacedoc().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    });

    s.init().on('finish', () => {
      s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        page = JSON.parse(data)[0];

        expect(page.type).to.equal('page');
        done();
      }).catch(done);
    });
  });

  it('flags pages with code hooks as "component"', done => {
    const s = new Spacedoc().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    }).adapter('sass');

    s.init().on('finish', () => {
      s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        data = JSON.parse(data);

        for (var i in data) {
          if (data[i].name === 'Button')
            expect(data[i].type).to.equal('component')
        }

        done();
      }).catch(done);
    });
  });

  it('allows for custom page types', done => {
    const s = new Spacedoc().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
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

    s.init().on('finish', () => {
      s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        page = JSON.parse(data)[0];

        expect(page.type).to.equal('custom');
        done();
      }).catch(done);
    });
  });

  it('creates a JSON file of search results', done => {
    const s = new Spacedoc().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    }).adapter('sass').adapter('js');

    s.init().on('finish', () => {
      s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        data = JSON.parse(data);

        expect(data).to.be.an('array');
        expect(data).to.have.length(18);
        done();
      }).catch(done);
    });
  });

  it('allows extra external results to be added', done => {
    const s = new Spacedoc().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true,
      search: {
        extra: 'test/fixtures/search.yml'
      }
    }).adapter('sass').adapter('js');

    s.init().on('finish', () => {
      s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        data = JSON.parse(data);

        expect(data).to.be.an('array');
        expect(data).to.have.length(18 + 2); // 2 extra results in the YML file
        done();
      }).catch(done);
    });
  });
});
