const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Spacedoc = require('..').Spacedoc;
const MockAdapter = require('./fixtures/mock-adapter');

chai.use(sinonChai);
const { expect } = chai;

describe('Spacedoc.parseDocs()', () => {
  let output;

  before(done => {
    sinon.spy(MockAdapter, 'parse');

    const s = new Spacedoc;
    s.adapter(MockAdapter);
    s.config({
      config: {
        custom: { setting: 'hi' }
      }
    });
    s.parseDocs({ custom: 'customValue' }).then(data => {
      output = data;
      done();
    }).catch(done)
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

  it('creates top-level groups for items', () => {
    expect(output[0].data).to.have.keys(['cat', 'dog']);
  });

  it('sorts items into groups', () => {
    expect(output[0].data.cat).to.be.an('array');
    expect(output[0].data.dog).to.be.an('array');
  });

  it('filters out items', () => {
    // 1 of the 3 is private
    expect(output[0].data.cat).to.have.lengthOf(2);
  });
});
