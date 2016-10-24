const { expect } = require('chai');
const adapter = require('..');

describe('JSDoc Adapter', () => {
  describe('getExample()', () => {
    it('parses an example with a caption', () => {
      expect(adapter.getExample('<caption>This is a caption.</caption>\n"use strict";')).to.eql({
        language: 'js',
        code: '"use strict";',
        description: 'This is a caption.',
      });
    });

    it('parses an example with no caption', () => {
      expect(adapter.getExample('"use strict";')).to.eql({
        language: 'js',
        code: '"use strict";',
      });
    });
  });
});
