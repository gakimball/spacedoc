const { expect } = require('chai');
const organizePages = require('../lib/util/organizePages');

describe('organizePages()', () => {
  it('sorts pages alphabetically', () => {
    const pages = [
      { fileName: 'b.html' },
      { fileName: 'a.html' },
    ];

    expect(pages.sort(organizePages)).to.eql([
      { fileName: 'a.html' },
      { fileName: 'b.html' },
    ]);
  });

  it('sorts numeric pages', () => {
    const pages = [
      { fileName: '2-thing.html' },
      { fileName: '1-thing.html' },
    ];

    expect(pages.sort(organizePages)).to.eql([
      { fileName: '1-thing.html' },
      { fileName: '2-thing.html' },
    ]);
  });

  it('sorts numeric pages with leading zeroes', () => {
    const pages = [
      { fileName: '2-thing.html' },
      { fileName: '01-thing.html' },
    ];

    expect(pages.sort(organizePages)).to.eql([
      { fileName: '01-thing.html' },
      { fileName: '2-thing.html' },
    ]);
  });

  it('sorts numeric pages above regular ones', () => {
    const pages = [
      { fileName: 'a.html' },
      { fileName: '1-thing.html' },
    ];

    expect(pages.sort(organizePages)).to.eql([
      { fileName: '1-thing.html' },
      { fileName: 'a.html' },
    ]);
  });

  it('sorts a mix of all of the above', () => {
    const pages = [
      { fileName: 'a.html' },
      { fileName: '1-thing.html' },
      { fileName: 'b.html' },
      { fileName: '03-thing.html' },
    ];

    expect(pages.sort(organizePages)).to.eql([
      { fileName: '1-thing.html' },
      { fileName: '03-thing.html' },
      { fileName: 'a.html' },
      { fileName: 'b.html' },
    ]);
  });
});
