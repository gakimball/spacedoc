const { expect } = require('chai');
const { Supercollider } = require('..');

describe('Supercollider constructor', () => {
  it('creates a new instance of Supercollider', () => {
    var s = new Supercollider();
    expect(s).to.be.an.instanceOf(Supercollider);
  });

  it('sets blank defaults for config settings', () => {
    var s = new Supercollider();

    expect(s.options).to.be.an('object');
    expect(s.searchOptions).to.be.an('object');
    expect(s.searchOptions).to.have.all.keys(['extra', 'sort', 'pageTypes']);
    expect(s.adapters).to.be.an('object');
    expect(s.tree).to.be.an('array');
    expect(s.template).to.be.null;
  });
});
