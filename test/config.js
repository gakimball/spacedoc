const { expect } = require('chai');
const { Supercollider } = require('..');

describe('Supercollider.config()', () => {
  it('sets configuration settings', () => {
    var s = new Supercollider();
    s = s.config({
      src: 'src',
      dest: 'dest',
      template: 'test/fixtures/template.html'
    }).adapter('sass').adapter('js');

    expect(s).to.be.an.instanceOf(Supercollider);
    expect(s.options.src).to.equal('src');
    expect(s.options.dest).to.equal('dest');
  });

  it('throws an error if no template is defined', () => {
    var s = new Supercollider();
    s = s.config({
      src: 'src',
      dest: 'dest',
      template: 'test/fixtures/template.html'
    }).adapter('sass').adapter('js');

    expect(s.template).to.be.a('function');
  });
});
