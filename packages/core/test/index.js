const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Spacedoc = require('..');

const {expect} = chai;

chai.use(chaiAsPromised);

describe('spacedoc()', () => {
  it('parses a folder of pages', () => {
    const s = new Spacedoc({
      pages: 'test/fixtures'
    });

    return expect(s.parse()).to.eventually.have.property('pages').with.lengthOf(4);
  });

  it('parses a glob of docs', () => {
    const s = new Spacedoc({
      adapters: ['./test/fixtures/adapter'],
      docs: ['test/fixtures']
    });

    return expect(s.parse()).to.eventually.have.deep.property('docs.fixture').with.lengthOf(1);
  });
});
