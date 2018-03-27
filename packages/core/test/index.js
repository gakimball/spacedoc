const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const spacedoc = require('..');

const { expect } = chai;

chai.use(chaiAsPromised);

describe('spacedoc()', () => {
  it('parses a folder of pages', () => {
    return expect(spacedoc({
      pages: 'test/fixtures',
    })()).to.eventually.have.property('pages').with.lengthOf(4);
  });

  it('parses a glob of docs', () => {
    return expect(spacedoc({
      adapters: ['./test/fixtures/adapter'],
      docs: ['test/fixtures'],
    })()).to.eventually.have.deep.property('docs.fixture').with.lengthOf(1);
  });
});
