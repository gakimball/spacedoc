const fs = require('fs');
const {expect} = require('chai');
const {Spacedoc} = require('..');
const vfs = require('vinyl-fs');

describe('Spacedoc.init()', () => {
  it('parses and builds a documentation page', () => {
    const s = new Spacedoc().config({
      input: 'test/fixtures/example.md',
      output: 'test/fixtures/_build',
      silent: true
    });

    return s.init().then(() => {
      expect(fs.existsSync('test/fixtures/_build/example.html')).to.be.ok;
    });
  });

  it('works within a stream of Vinyl files if src and dest are omitted', done => {
    const s = new Spacedoc().config({
      template: 'test/fixtures/template.pug',
      silent: true
    });

    vfs.src('test/fixtures/example.md')
      .pipe(s.init())
      .on('error', done)
      .on('data', file => {
        expect(file.path).to.contain('.html');
        expect(file.contents.toString()).to.contain('<h2');
        done();
      });
  });

  it('adds a generated page to the tree', () => {
    const s = new Spacedoc().config({
      input: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    return s.init().then(() => {
      expect(s.tree).to.have.lengthOf(1);
    });
  });

  it('resets the internal data tree on each build', () => {
    const s = new Spacedoc().config({
      input: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    return s.init().then(() => s.init()).then(() => {
      expect(s.tree).to.have.length(1);
    });
  });
});
