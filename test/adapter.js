const { expect } = require('chai');
const { Spacedoc } = require('..');

describe('Spacedoc.adapter()', () => {
  it('loads an adapter', () => {
    let s = new Spacedoc();
    s = s.adapter('test/fixtures/spacedoc-mock');

    expect(s).to.be.an.instanceOf(Spacedoc);
    expect(s.adapters).to.have.key('mock');
    expect(s.adapters.mock.config).to.exist;
  });
});
