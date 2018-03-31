const {expect} = require('chai');
const mock = require('mock-require');
const {Spacedoc} = require('..');

describe('Spacedoc.addAdapter()', () => {
  before(() => {
    const adapter = () => {};
    adapter.adapterName = 'test';
    adapter.config = () => ({puppies: false});
    mock('spacedoc-test', adapter);
  });

  after(() => mock.stop('spacedoc-test'));

  it('returns itself', () => {
    const s = new Spacedoc().addAdapter('test');
    expect(s).to.be.an.instanceOf(Spacedoc);
  });

  it('loads an adapter from node_modules', () => {
    const s = new Spacedoc().addAdapter('test');
    expect(s.adapters.test).to.be.an('object');
  });

  it('loads an adapter from a local path', () => {
    const s = new Spacedoc().addAdapter('test/fixtures/spacedoc-mock');
    expect(s.adapters.mock).to.be.an('object');
  });

  it('throws an error if no adapter is found', () => {
    const s = new Spacedoc();
    expect(() => s.addAdapter('test/fixtures/spacedoc-nope')).to.throw(Error);
  });

  it('combines adapter configuration', () => {
    const s = new Spacedoc().addAdapter(['test', {kittens: true}]);
    expect(s.adapters.test.config).to.eql({
      puppies: false,
      kittens: true
    });
  });

  it('adapter contains a parse() function', () => {
    const s = new Spacedoc().addAdapter('test');
    expect(s.adapters.test.parse).to.be.a('function');
  });

  it('adapter contains a config object', () => {
    const s = new Spacedoc().addAdapter('test');
    expect(s.adapters.test.config).to.be.an('object');
  });
});
