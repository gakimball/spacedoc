const { expect } = require('chai');
const fs = require('fs');
const rimraf = require('rimraf');
const { Spacedoc } = require('..');
const vfs = require('vinyl-fs');

describe('Spacedoc.init()', () => {
  it('parses and builds a documentation page', done => {
    const s = new Spacedoc();
    s.config({
      src: 'test/fixtures/example.md',
      dest: 'test/fixtures/_build',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    const stream = s.init();

    expect(stream).to.have.property('on');
    stream.on('finish', () => {
      expect(fs.existsSync('test/fixtures/_build/example.html')).to.be.ok;
      done();
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

  it('resets the internal data tree on each build', done => {
    const s = new Spacedoc();
    s.config({
      src: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    s.init().on('finish', () => {
      expect(s.tree).to.have.length(1);

      s.init().on('finish', () => {
        expect(s.tree).to.have.length(1);
        done();
      });
    });
  });

  it('allows for incremental builds', done => {
    const s = new Spacedoc();
    s.config({
      src: 'test/fixtures/example.md',
      template: 'test/fixtures/template.pug',
      silent: true
    });

    s.init().on('finish', () => {
      expect(s.tree).to.have.length(1);

      s.init({ incremental: true }).on('finish', () => {
        expect(s.tree).to.have.length(1);
        done();
      });
    });
  });

  it('can be run without first calling Spacedoc.config()', () => {
    const s = new Spacedoc();
    s.init();
    expect(s.options).to.not.be.empty;
  });
});
