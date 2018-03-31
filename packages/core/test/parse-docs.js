const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const parseDocs = require('../lib/parse-docs');

const {expect} = chai;

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('parseDocs()', () => {
  it('returns a function', () => {
    expect(parseDocs()).to.be.a('function');
  });

  describe('getDoclets()', () => {
    it('returns a null value if file has no matching extension', () => {
      expect(parseDocs()('file.js')).to.eventually.eql({
        adapter: null,
        doclets: []
      });
    });

    it('passes the file path and adapter config to the parsing function', () => {
      const stub = sinon.stub();
      const config = {
        puppies: true
      };
      const adapters = new Map([['mock', {
        name: 'mock',
        extensions: ['js'],
        parse: stub,
        config
      }]]);

      stub.resolves([]);

      return parseDocs(adapters)('file.js').then(() => {
        expect(stub).to.have.been.calledWithExactly('file.js', config);
      });
    });

    it('returns a set of doclets', () => {
      const doclets = [{kittens: true}];
      const adapters = new Map([['mock', {
        name: 'mock',
        extensions: ['js'],
        parse: () => Promise.resolve(doclets),
        config: {}
      }]]);

      return expect(parseDocs(adapters)('file.js')).to.eventually.eql({
        adapter: 'mock',
        doclets
      });
    });
  });
});
