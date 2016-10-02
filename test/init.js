const { expect } = require('chai');
const fs = require('fs');
const rimraf = require('rimraf');
const { Spacedoc } = require('..');
const vfs = require('vinyl-fs');

describe('Spacedoc.init()', () => {
  it('parses and builds a documentation page', () => {
    const s = new Spacedoc();
    s.config({
      src: 'test/fixtures/example.md',
      dest: 'test/fixtures/_build',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    return s.init().then(() => {
      expect(fs.existsSync('test/fixtures/_build/example.html')).to.be.ok;
    });
  });

  it('works within a stream of Vinyl files if src and dest are omitted', done => {
    const s = new Spacedoc();
    s.config({
      template: 'test/fixtures/template.pug',
      silent: true
    });

    vfs.src('test/fixtures/example.md')
      .pipe(s.init())
      .on('data', function(file) {
        expect(file.path).to.contain('.html');
        expect(file.contents.toString()).to.contain('<h2');
        done();
      });
  });

  it('resets the internal data tree on each build', () => {
    const s = new Spacedoc();
    s.config({
      src: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    return s.init().then(() => s.init()).then(() => {
      expect(s.tree).to.have.length(1);
    });
  });

  it('allows for incremental builds', () => {
    const s = new Spacedoc();
    s.config({
      src: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    return s.init().then(() => s.init()).then(() => {
      expect(s.tree).to.have.length(1);
    });
  });

  it('can be run without first calling Spacedoc.config()', () => {
    const s = new Spacedoc();
    expect(() => s.init()).to.not.throw(Error);
  });
});
