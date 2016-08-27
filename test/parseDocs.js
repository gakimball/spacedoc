const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Spacedoc = require('..').Spacedoc;
const MockAdapter = require('./fixtures/spacedoc-mock');

chai.use(sinonChai);
const { expect } = chai;

describe('Spacedoc.parseDocs()', () => {
  let output;

  before(done => {
    sinon.spy(MockAdapter, 'parse');

    const s = new Spacedoc;
    s.config({
      adapters: ['test/fixtures/spacedoc-mock'],
      config: {
        mock: { setting: 'hi' }
      }
    });
    s.parseDocs({ mock: 'customValue' }).then(data => {
      output = data;
      done();
    }).catch(done);
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
