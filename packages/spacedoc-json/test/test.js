const {expect} = require('chai');
const parseItem = require('../lib/parse-item');
const getTypes = require('../lib/get-types');

describe('JSON Schema Adapter', () => {
  describe('Parser', () => {
    it('converts a path to a JSON file into a set of doclets', () => {

    });
  });

  describe('parseItem()', () => {
    it('produces a doclet from a JSON schema', () => {
      const Input = {
        type: 'string',
        title: 'Name',
        description: 'Name of cat.',
        default: 'Winston'
      };

      expect(parseItem(Input, 'path/to/schema.json')).to.eql({
        meta: {
          name: 'Name',
          longname: 'root',
          description: 'Name of cat.',
          file: {
            path: 'path/to/schema.json',
            name: 'schema.json'
          }
        },
        types: ['string'],
        value: 'Winston'
      });
    });

    it('recursively parses properties of an object schema', () => {
      const Input = {
        type: 'object',
        title: 'Cat Info',
        description: 'Info on cat.',
        properties: {
          name: {
            title: 'Cat Name',
            type: 'string',
            description: 'Name of cat.',
            default: 'Winston'
          },
          age: {
            title: 'Cat Age',
            type: 'number',
            description: 'Age of cat.',
            default: 16
          }
        }
      };

      expect(parseItem(Input, 'path/to/schema.json')).to.eql({
        meta: {
          name: 'Cat Info',
          longname: 'root',
          description: 'Info on cat.',
          file: {
            path: 'path/to/schema.json',
            name: 'schema.json'
          }
        },
        types: ['object'],
        value: undefined,
        properties: [
          {
            name: 'name',
            description: 'Name of cat.',
            types: ['string'],
            default: 'Winston'
          },
          {
            name: 'age',
            description: 'Age of cat.',
            types: ['number'],
            default: 16
          }
        ],
        children: [
          {
            meta: {
              name: 'Cat Name',
              longname: 'name',
              description: 'Name of cat.',
              file: {
                path: 'path/to/schema.json',
                name: 'schema.json'
              }
            },
            types: ['string'],
            value: 'Winston'
          },
          {
            meta: {
              name: 'Cat Age',
              longname: 'age',
              description: 'Age of cat.',
              file: {
                path: 'path/to/schema.json',
                name: 'schema.json'
              }
            },
            types: ['number'],
            value: 16
          }
        ]
      });
    });

    it('recursively parses the item schema of an array schema', () => {
      const JsonSchema = {
        title: 'Cats',
        type: 'array',
        description: 'List of cats.',
        items: {
          title: 'Cat Name',
          type: 'string',
          description: 'Name of cat.',
          default: 'Winston'
        }
      };

      expect(parseItem(JsonSchema, 'path/to/schema.json')).to.eql({
        meta: {
          name: 'Cats',
          longname: 'root',
          description: 'List of cats.',
          file: {
            path: 'path/to/schema.json',
            name: 'schema.json'
          }
        },
        types: ['array'],
        value: undefined,
        children: [{
          meta: {
            name: 'Cat Name',
            longname: 'root.items',
            description: 'Name of cat.',
            file: {
              path: 'path/to/schema.json',
              name: 'schema.json'
            }
          },
          types: ['string'],
          value: 'Winston'
        }]
      });
    });
  });

  describe('getTypes()', () => {
    it('returns an empty array for undefined values', () => {
      expect(getTypes()).to.eql([]);
    });

    it('converts a string to an array with one item', () => {
      expect(getTypes('string')).to.eql(['string']);
    });

    it('keeps arrays as-is', () => {
      expect(getTypes(['string', 'number'])).to.eql(['string', 'number']);
    });
  });
});
