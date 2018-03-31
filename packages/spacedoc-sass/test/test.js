const {expect} = require('chai');
const getTypes = require('../lib/get-types');
const getPreview = require('../lib/get-preview');
const parseSassDoc = require('./util/parse-sassdoc');

describe('SassDoc Adapter', () => {
  describe('getPreview()', () => {
    it('renders a variable sample', done => {
      parseSassDoc('variable-basic').then(item => {
        expect(getPreview(item)).to.have.property('code', '$variable-basic: \'Hello.\';');
        done();
      }).catch(done);
    });

    it('renders a function sample', done => {
      parseSassDoc('function-basic').then(item => {
        expect(getPreview(item)).to.have.property('code', 'function-basic();');
        done();
      }).catch(done);
    });

    it('renders a mixin sample', done => {
      parseSassDoc('mixin-basic').then(item => {
        expect(getPreview(item)).to.have.property('code', '@include mixin-basic();');
        done();
      }).catch(done);
    });

    it('renders a placeholder sample', done => {
      parseSassDoc('placeholder-basic').then(item => {
        expect(getPreview(item)).to.have.property('code', '@extend %placeholder-basic;');
        done();
      }).catch(done);
    });
  });

  describe('getTypes()', () => {
    it('renders an item with one type', () => {
      return parseSassDoc('variable-typed').then(item => {
        expect(getTypes(item.type)).to.eql(['Number']);
      });
    });

    it('renders an item with multiple types', () => {
      return parseSassDoc('variable-multi-typed').then(item => {
        expect(getTypes(item.type)).to.eql(['Number', 'String']);
      });
    });
  });
});
