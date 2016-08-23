const { expect } = require('chai');
const fs = require('fs');
const rimraf = require('rimraf');
const { Supercollider } = require('..');

describe('Supercollider.buildSearch()', () => {
  afterEach(done => {
    rimraf('test/fixtures/_build', done);
  });

  it('works even if searchConfig() was not called', done => {
    var s = new Supercollider().config({
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
    var s = new Supercollider().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    }).searchConfig({});

    s.init().on('finish', () => {
      s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        page = JSON.parse(data)[0];

        expect(page.type).to.equal('page');
        done();
      });
    });
  });

  it('flags pages with code hooks as "component"', done => {
    var s = new Supercollider().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    }).searchConfig({}).adapter('sass');

    s.init().on('finish', () => {
      s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        data = JSON.parse(data);

        for (var i in data) {
          if (data[i].name === 'Button')
            expect(data[i].type).to.equal('component')
        }

        done();
      });
    });
  });

  it('allows for custom page types', done => {
    var s = new Supercollider().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    }).searchConfig({
      pageTypes: {
        custom: function(item) {
          expect(item).to.be.an('object');
          return true;
        }
      }
    });

    s.init().on('finish', () => {
      s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        page = JSON.parse(data)[0];

        expect(page.type).to.equal('custom');
        done();
      });
    });
  });

  it('creates a JSON file of search results', done => {
    var s = new Supercollider().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    }).searchConfig({}).adapter('sass').adapter('js');

    s.init().on('finish', () => {
      s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        data = JSON.parse(data);

        expect(data).to.be.an('array');
        expect(data).to.have.length(17);
        done();
      });
    });
  });

  it('allows extra external results to be added', done => {
    var s = new Supercollider().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    }).searchConfig({
      extra: 'test/fixtures/search.yml'
    }).adapter('sass').adapter('js');

    s.init().on('finish', () => {
      s.buildSearch('test/fixtures/_build/search.json').then(() => {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        data = JSON.parse(data);

        expect(data).to.be.an('array');
        expect(data).to.have.length(17 + 2); // 2 extra results in the YML file
        done();
      });
    });
  });
});
