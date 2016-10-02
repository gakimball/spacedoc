const { expect } = require('chai');
const sinon = require('sinon');
const Spacedoc = require('..').Spacedoc;
const MockAdapter = require('./fixtures/spacedoc-mock');

describe('Spacedoc.parseDocs()', () => {
  let output;

  before(() => {
    sinon.spy(MockAdapter, 'parse');

    const s = new Spacedoc;
    s.config({
      adapters: ['test/fixtures/spacedoc-mock'],
      config: {
        mock: { setting: 'hi' }
      }
    });

    return s.parseDocs({ mock: 'customValue' }).then(data => {
      output = data;
    });
  });

  after(() => {
    MockAdapter.parse.restore();
  });

  it('returns an array of adapter data objects', () => {
    expect(output).to.have.lengthOf(1);
    expect(output[0]).to.have.keys(['adapter', 'data']);
  });

  it('calls Adapter.parse() with input value and global configs', () => {
    expect(MockAdapter.parse).to.have.been.calledWithExactly('customValue', { setting: 'hi' });
  });

  it('filters out items', () => {
    // 1 of the 5 is private
    expect(output[0].data).to.have.lengthOf(4);
  });
});
