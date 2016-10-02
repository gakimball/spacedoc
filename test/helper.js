const { expect } = require('chai');
const helper = require('../lib/util/helper');
const mockAdapter = require('./fixtures/spacedoc-mock');
const $ = require('cheerio');
const { Spacedoc } = require('..');
const mockVinyl = require('./util/mockVinyl');

const TEST_FILE = mockVinyl('test/fixtures/example.md');

describe('helper()', () => {
  let fn;

  before(() => {
    const instance = {
      adapters: { 'mock': mockAdapter }
    }
    const s = new Spacedoc();
    s.config({
      adapters: ['test/fixtures/spacedoc-mock']
    });
    return s.parse(TEST_FILE).then(() => {
      fn = helper.call(instance, s.tree[0]);
    });
  })

  it('renders a specific adapter', () => {
    const html = fn('mock');
    expect($(html).find('li')).to.have.lengthOf(4);
  });

  it('renders a specific group', () => {
    const html = fn('mock', 'cat');
    expect($(html).find('li')).to.have.lengthOf(2);
  });

  it('renders a specific item in a group', () => {
    const html = fn('mock', 'cat', 'Maru');
    expect($(html).find('li')).to.have.lengthOf(1);
  });
});
