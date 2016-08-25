const { expect } = require('chai');
const { Spacedoc } = require('..');

describe('Spacedoc.adapter()', () => {
  it('loads built-in adapters', () => {
    var s = new Spacedoc();
    s = s.adapter('sass');

    expect(s).to.be.an.instanceOf(Spacedoc);
    expect(s.adapters).to.have.key('sass');
    expect(s.adapters.sass.config).to.exist;
  });

  it('throws an error if you try to load a non-existant built-in adapter', () => {
    var s = new Spacedoc();

    expect(() => {
      s.adapter('kitten');
    }).to.throw(Error);
  });

  it('loads custom adapters', () => {
    var s = new Spacedoc();
    s = s.adapter('custom', () => {});

    expect(s.adapters).to.have.key('custom');
    expect(s.adapters.custom).to.be.a('function');
  });

  it('throws an error if you use a reserved keyword as an adapter name', () => {
    var s = new Spacedoc();

    expect(() => {
      s.adapter('docs', () => {});
    }).to.throw(Error);
  });

  it('throws an error if you try to pass something other than a function as an adapter', () => {
    var s = new Spacedoc();

    expect(() => {
      s.adapter('docs', 'kittens');
    }).to.throw(Error);
  });
});
