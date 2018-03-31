const {expect} = require('chai');
const findDoclets = require('../lib/util/find-doclets');

describe('findDoclets()', () => {
  it('returns a function', () => {
    expect(findDoclets({})).to.be.a('function');
  });

  describe('find()', () => {
    let find;
    const doclets = {
      // Basic examples
      one: [
        {id: 1, kittens: true},
        {id: 2, kittens: false},
        {id: 3, kittens: true}
      ],
      // Examples for private inheritence
      two: [
        {
          id: 1,
          meta: {
            longname: 'one'
          },
          access: 'private'
        },
        {
          id: 2,
          meta: {
            longname: 'two'
          },
          parent: 'one'
        },
        {
          id: 3,
          meta: {
            longname: 'three'
          },
          parent: 'two'
        }
      ]
    };

    before(() => {
      find = findDoclets(doclets);
    });

    it('returns an empty array for a non-existent scope', () => {
      expect(find('nope')).to.eql([]);
    });

    it('finds all items within a scope', () => {
      expect(find('one')).to.eql(doclets.one);
    });

    it('finds items with certain qualities', () => {
      expect(find('one', ['kittens', true])).to.have.lengthOf(2);
    });

    it('filers out private items', () => {
      expect(find('two', ['id', 1])).to.eql([]);
    });

    it('filters out items with private ancestors', () => {
      expect(find('two', ['id', 3])).to.eql([]);
    });
  });
});
