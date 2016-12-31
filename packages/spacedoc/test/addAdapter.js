const { expect } = require('chai');
const mock = require('mock-require');
const { Spacedoc } = require('..');

describe('Spacedoc.addAdapter()', () => {
  before(() => {
    const adapter = () => {};
    adapter.adapterName = 'test';
    mock('spacedoc-test', adapter);
  });

  after(() => mock.stop('spacedoc-test'))

  it('returns itself', () => {
    const s = new Spacedoc().addAdapter('test');
    expect(s).to.be.an.instanceOf(Spacedoc);
  });

  it('loads an adapter from node_modules', () => {
    const s = new Spacedoc().addAdapter('test');
    expect(s.adapters.test).to.be.a('function');
  });

  it('loads an adapter from a local path', () => {
    const s = new Spacedoc().addAdapter('test/fixtures/spacedoc-mock');
    expect(s.adapters.mock).to.be.a('function');
  });

  it('throws an error if no adapter is found', () => {
    const s = new Spacedoc();
    expect(() => s.addAdapter('test/fixtures/spacedoc-nope')).to.throw(Error);
  });
});
