const { expect } = require('chai');
const loadTemplates = require('../lib/util/loadTemplates');

describe('loadTemplates', () => {
  it('loads a folder of templates', () => {
    const templates = loadTemplates('test/fixtures/template');
    expect(templates).to.be.an('object');
    expect(templates.default).to.be.a('function')
  });

  it('throws an error if any template fails to compile', () => {
    expect(() => {
      const templates = loadTemplates('test/fixtures/template-broken');
    }).to.throw(Error);
  });
});
