const { expect } = require('chai');
const { Supercollider } = require('..');

describe('Supercollider.adapter()', () => {
  it('loads built-in adapters', () => {
    var s = new Supercollider();
    s = s.adapter('sass');

    expect(s).to.be.an.instanceOf(Supercollider);
    expect(s.adapters).to.have.key('sass');
    expect(s.adapters.sass.config).to.exist;
  });

  it('throws an error if you try to load a non-existant built-in adapter', () => {
    var s = new Supercollider();

    expect(() => {
      s.adapter('kitten');
    }).to.throw(Error);
  });

  it('loads custom adapters', () => {
    var s = new Supercollider();
    s = s.adapter('custom', () => {});

    expect(s.adapters).to.have.key('custom');
    expect(s.adapters.custom).to.be.a('function');
  });

  it('throws an error if you use a reserved keyword as an adapter name', () => {
    var s = new Supercollider();

    expect(() => {
      s.adapter('docs', () => {});
    }).to.throw(Error);
  });

  it('throws an error if you try to pass something other than a function as an adapter', () => {
    var s = new Supercollider();

    expect(() => {
      s.adapter('docs', 'kittens');
    }).to.throw(Error);
  });
});
