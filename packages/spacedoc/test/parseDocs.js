const { expect } = require('chai');
const sinon = require('sinon');
const Spacedoc = require('..').Spacedoc;
const MockAdapter = require('./fixtures/spacedoc-mock');

describe('Spacedoc.parseDocs()', () => {
  let output, AdapterFunc;

  before(() => {
    AdapterFunc = sinon.spy(MockAdapter);

    const s = new Spacedoc().config({
      adapters: ['test/fixtures/spacedoc-mock'],
      config: {
        mock: { setting: 'hi' }
      }
    });

    return s.parseDocs({ mock: 'customValue' }).then(data => {
      output = data;
    });
  });

  it('returns an array of adapter data objects', () => {
    expect(output).to.have.lengthOf(1);
    expect(output[0]).to.have.keys(['adapter', 'data']);
  });

  xit('calls Adapter.parse() with input value and global configs', () => {
    expect(AdapterFunc).to.have.been.calledWithExactly('customValue', { setting: 'hi' });
  });
});
