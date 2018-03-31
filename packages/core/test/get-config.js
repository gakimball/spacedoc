const path = require('path');
const {expect} = require('chai');
const getConfig = require('../lib/get-config');

describe('getConfig()', () => {
  it('returns an object', () => {
    expect(getConfig()).to.be.an('object');
  });

  it('loads adapters', () => {
    const config = getConfig({
      adapters: ['./test/fixtures/adapter']
    });

    expect(config.adapters.has('fixture')).to.equal(true);
  });

  describe('External config loading', () => {
    let oldCwd;

    before(() => {
      oldCwd = process.cwd();
      process.chdir(path.join(__dirname, 'fixtures'));
    });

    after(() => {
      process.chdir(oldCwd);
    });

    it('loads from an external config file', () => {
      expect(getConfig()).to.have.property('pages', 'kittens');
    });
  });
});
