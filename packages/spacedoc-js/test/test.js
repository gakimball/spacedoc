const { expect } = require('chai');
const getExample = require('../lib/get-example');

describe('JSDoc Adapter', () => {
  describe('getExample()', () => {
    it('parses an example with a caption', () => {
      expect(getExample('<caption>This is a caption.</caption>\n"use strict";')).to.eql({
        language: 'js',
        code: '"use strict";',
        description: 'This is a caption.',
      });
    });

    it('parses an example with no caption', () => {
      expect(getExample('"use strict";')).to.eql({
        language: 'js',
        code: '"use strict";',
      });
    });
  });
});
