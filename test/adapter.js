const { expect } = require('chai');
const { Spacedoc } = require('..');
const MockAdapter = require('./fixtures/mock-adapter');

describe('Spacedoc.adapter()', () => {
  it('loads built-in adapters', () => {
    let s = new Spacedoc();
    s = s.adapter('sass');

    expect(s).to.be.an.instanceOf(Spacedoc);
    expect(s.adapters).to.have.key('sass');
    expect(s.adapters.sass.config).to.exist;
  });

  it('throws an error if you try to load a non-existant built-in adapter', () => {
    const s = new Spacedoc();

    expect(() => {
      s.adapter('kitten');
    }).to.throw(Error);
  });

  it('loads custom adapters', () => {
    let s = new Spacedoc();
    s = s.adapter(MockAdapter);

    expect(s.adapters).to.have.key('custom');
    expect(s.adapters.custom).to.be.a('function');
  });

  it('throws an error if you try to pass something other than a function as an adapter', () => {
    const s = new Spacedoc();

    expect(() => {
      s.adapter({});
    }).to.throw(Error);
  });

  it('throws an error if an adapter does not have a name', () => {
    const s = new Spacedoc();
    const BadAdapter = class BadAdapter {};

    expect(() => {
      s.adapter(BadAdapter);
    }).to.throw(Error);
  });
});
