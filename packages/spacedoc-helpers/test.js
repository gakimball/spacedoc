const {expect} = require('chai');
const sortPages = require('./lib/sort-pages');
const {highlight, markdown, title, groupPages} = require('.');

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
      {title: 'One', fileName: 'one.html', group: null},
      {title: 'Two', fileName: 'two.html', group: 'Group'}
    ];
    expect(groupPages(pages)).to.eql([
      {name: '$default', pages: [pages[0]]},
      {name: 'Group', pages: [pages[1]]}
    ]);
  });

  it('sorts pages within each group', () => {
    const pages = [
      {title: 'One', fileName: 'one.html', group: null},
      {title: 'Two', fileName: 'two.html', group: 'Group', order: 2},
      {title: 'Three', fileName: 'three.html', group: 'Group', order: 1}
    ];
    expect(groupPages(pages)).to.eql([
      {name: '$default', pages: [pages[0]]},
      {name: 'Group', pages: [pages[2], pages[1]]}
    ]);
  });
});

describe('sortPages()', () => {
  it('sorts pages alphabetically', () => {
    const pages = [
      {fileName: 'b.html'},
      {fileName: 'a.html'}
    ];

    expect(pages.sort(sortPages)).to.eql([
      {fileName: 'a.html'},
      {fileName: 'b.html'}
    ]);
  });

  it('sorts numeric pages', () => {
    const pages = [
      {fileName: 'a.html', order: 2},
      {fileName: 'b.html', order: 1}
    ];

    expect(pages.sort(sortPages)).to.eql([
      {fileName: 'b.html', order: 1},
      {fileName: 'a.html', order: 2}
    ]);
  });

  it('sorts numeric pages above regular ones', () => {
    const pages = [
      {fileName: 'a.html'},
      {fileName: 'b.html', order: 1}
    ];

    expect(pages.sort(sortPages)).to.eql([
      {fileName: 'b.html', order: 1},
      {fileName: 'a.html'}
    ]);
  });

  it('sorts a mix of all of the above', () => {
    const pages = [
      {fileName: 'a.html'},
      {fileName: 'one.html', order: 1},
      {fileName: 'b.html'},
      {fileName: 'two.html', order: 2}
    ];

    expect(pages.sort(sortPages)).to.eql([
      {fileName: 'one.html', order: 1},
      {fileName: 'two.html', order: 2},
      {fileName: 'a.html'},
      {fileName: 'b.html'}
    ]);
  });
});
