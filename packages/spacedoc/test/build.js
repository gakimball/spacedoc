const { expect } = require('chai');
const sinon = require('sinon');
const { Spacedoc } = require('..');
const mockVinyl = require('./util/mockVinyl');

const TEST_FILE = mockVinyl('test/fixtures/example.md');
const TEST_FILE_ALT = mockVinyl('test/fixtures/example-alt-layout.md');

describe('Spacedoc.build()', () => {
  it('builds an HTML file from the data of a page', () => {
    const s = new Spacedoc().config({
      theme: 'test/fixtures/theme'
    });

    const output = s.build({ kittens: 'kittens' });
    expect(output).to.be.a('string');
    expect(output).to.contain('<p>kittens');
  });

  it('throws Pug errors', () => {
    const s = new Spacedoc().config({
      theme: 'test/fixtures/theme-broken'
    });

    expect(s.build).to.throw(Error);
  });

  it('allows Front Matter to be retained on the page', () => {
    const s = new Spacedoc().config({
      theme: 'test/fixtures/theme',
      keepFm: true
    });

    return expect(s.parse(TEST_FILE).then(data => s.build(data))).to.eventually.contain('---');
  });

  it('allows an alternate layout to be used', () => {
    const s = new Spacedoc().config({
      theme: 'test/fixtures/theme',
    });

    return expect(s.parse(TEST_FILE_ALT).then(data => s.build(data))).to.eventually.contain('<p>Puppies');
  });
});
