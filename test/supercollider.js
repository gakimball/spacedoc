const { expect } = require('chai');
const { Spacedoc } = require('..');

describe('Spacedoc constructor', () => {
  it('creates a new instance of Spacedoc', () => {
    const s = new Spacedoc();
    expect(s).to.be.an.instanceOf(Spacedoc);
  });

  it('sets blank defaults for config settings', () => {
    const s = new Spacedoc();

    expect(s.options).to.be.an('object');
    expect(s.adapters).to.be.an('object');
    expect(s.tree).to.be.an('array');
    expect(s.template).to.be.null;
  });
});
