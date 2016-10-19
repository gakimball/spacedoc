const { expect } = require('chai');
const { highlight, markdown, title, groupPages } = require('.');

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

describe('title()', () => {
  it('capitalizes the first letter of a string', () => {
    expect(title('hello')).to.equal('Hello');
  });
});

describe('groupPages()', () => {
  it('sorts pages by group', () => {
    const pages = [
      { title: 'One', group: null },
      { title: 'Two', group: 'Group' }
    ];
    expect(groupPages(pages)).to.eql([
      { name: '$default', pages: [pages[0]] },
      { name: 'Group', pages: [pages[1]] }
    ]);
  });
});
