const { expect } = require('chai');
const parseSassDoc = require('./util/parseSassDoc');
const spacedocSass = require('..');
const { sample, type } = spacedocSass.helpers;

describe('Helpers', () => {
  describe('sample()', () => {
    it('renders a variable sample', done => {
      parseSassDoc('variable-basic').then(item => {
        expect(sample(item)).to.equal('$variable-basic: \'Hello.\';');
        done();
      }).catch(done);
    });

    it('renders a function sample', done => {
      parseSassDoc('function-basic').then(item => {
        expect(sample(item)).to.equal('function-basic();');
        done();
      }).catch(done);
    });

    it('renders a mixin sample', done => {
      parseSassDoc('mixin-basic').then(item => {
        expect(sample(item)).to.equal('@include mixin-basic();');
        done();
      }).catch(done);
    });

    it('renders a placeholder sample', done => {
      parseSassDoc('placeholder-basic').then(item => {
        expect(sample(item)).to.equal('@extend %placeholder-basic;');
        done();
      }).catch(done);
    });
  });

  describe('type()', () => {
    it('renders an item with one type', done => {
      parseSassDoc('variable-typed').then(item => {
        expect(type(item.type)).to.equal('Number');
        done();
      }).catch(done);
    });

    it('renders an item with multiple types', done => {
      parseSassDoc('variable-multi-typed').then(item => {
        expect(type(item.type)).to.equal('Number or String');
        done();
      }).catch(done);
    });
  });
});
