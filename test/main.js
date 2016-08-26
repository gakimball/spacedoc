const chai = require('chai');
const { expect } = chai;
const rimraf = require('rimraf');
const spacedoc = require('..');
const { Spacedoc, _instance } = spacedoc;

describe('spacedoc', () => {
  beforeEach(() => {
    _instance.options = {};
    _instance.adapters = {};
    _instance.tree = [];
    _instance.template = null;
  });

  describe('spacedoc()', () => {
    it('calls Spacedoc.init()', done => {
      spacedoc.config({
        adapters: ['test/fixtures/spacedoc-mock'],
        src: 'test/fixtures/example.md',
        silent: true
      });

      spacedoc({ incremental: true }).on('finish', () => {
        expect(spacedoc.tree).to.have.length(1);
        done();
      });
    });
  });

  describe('spacedoc.config()', () => {
    it('calls Spacedoc.config()', () => {
      spacedoc.config({ silent: true });

      expect(_instance.options.silent).to.be.true;
    });
  });

  describe('spacedoc.buildSearch()', () => {
    it('calls Spacedoc.buildSearch()', () => {
      spacedoc.config({
        adapters: ['test/fixtures/spacedoc-mock'],
        src: 'test/fixtures/example.md',
        silent: true
      });

      spacedoc({ incremental: true }).on('finish', done => {
        spacedoc.buildSearch('test/fixtures/_build/search.json').then(() => {
          const page = fs.readFileSync('test/fixtures/_build/search.json').toString();
          const data = JSON.parse(page);

          expect(data).to.be.an('array');
          done();
        });
      });
    });
  });

  describe('spacedoc.tree', () => {
    it('returns the page list', () => {
      _instance.tree = ['hi'];
      expect(spacedoc.tree).to.be.eql(['hi']);
    });
  });
});
