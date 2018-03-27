const { expect } = require('chai');
const mock = require('mock-require');
const getAdapter = require('../lib/get-adapter.js');

describe('getAdapter()', () => {
  before(() => {
    const adapter = {
      name: 'mock',
      extensions: [],
      parse: () => {},
      config: () => ({ puppies: false }),
    };

    mock('spacedoc-mock', adapter);
  });

  after(() => mock.stop('spacedoc-test'));

  it('loads an adapter from node_modules', () => {
    const adapter = getAdapter('mock');
    expect(adapter).to.have.property('name', 'mock');
  });

  it('loads an adapter from a local path', () => {
    const adapter = getAdapter('test/fixtures/adapter');
    expect(adapter).to.have.property('name', 'fixture');
  });

  it('throws an error if no adapter is found', () => {
    expect(() => getAdapter('nope')).to.throw(Error);
  });

  it('combines adapter configuration', () => {
    const adapter = getAdapter(['mock', { kittens: true }]);
    expect(adapter.config).to.eql({
      puppies: false,
      kittens: true,
    });
  });
});
