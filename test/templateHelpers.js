const { expect } = require('chai');
const { title, highlight, markdown } = require('../lib/templateHelpers');

describe('Template Helpers', () => {
  describe('title()', () => {
    it('capitalizes the first letter of a string', () => {
      expect(title('hello')).to.equal('Hello');
    });
  });

  describe('highlight()', () => {
    it('performs syntax highlighting', () => {
      expect(highlight('<div></div>')).to.contain('hljs-tag');
    });
  });

  describe('markdown()', () => {
    it('converts Markdown to HTML', () => {
      expect(markdown('# Hello')).to.contain('<h1');
    });
  });
});
