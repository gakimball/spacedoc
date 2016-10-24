const { expect } = require('chai');
const { Spacedoc } = require('..');

describe('Spacedoc.addAdapter()', () => {
  it('loads an adapter', () => {
    let s = new Spacedoc().addAdapter('test/fixtures/spacedoc-mock');

    expect(s).to.be.an.instanceOf(Spacedoc);
    expect(s.adapters.mock).to.be.a('function');
  });
});
