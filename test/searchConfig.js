const { expect } = require('chai');
const { Supercollider } = require('..');

describe('Supercollider.searchConfig()', () => {
  it('loads JSON data', () => {
    var s = new Supercollider();
    s.searchConfig({ extra: 'test/fixtures/search.json' });

    expect(s.searchOptions.extra).to.be.an('array');
    expect(s.searchOptions.extra).to.have.length(2);
  });

  it('loads YAML data', () => {
    var s = new Supercollider();
    s.searchConfig({ extra: 'test/fixtures/search.yml' });

    expect(s.searchOptions.extra).to.be.an('array');
    expect(s.searchOptions.extra).to.have.length(2);
  })
});
