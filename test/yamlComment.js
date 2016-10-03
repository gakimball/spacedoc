const { expect } = require('chai');
const yamlComment = require('../lib/util/yamlComment');

const pugInput =
`//-
  attr: value
  ---

h1 Hello world
`

const htmlInput =
`<!--
attr: value
-->

h1 Hello world
`;

const expected =
`---
attr: value
---

h1 Hello world
`;

describe('yamlComment()', () => {
  it('parses comments from .pug files', () => {
    expect(yamlComment(pugInput, '.pug')).to.equal(expected);
  });

  it('parses comments from .html files', () => {
    expect(yamlComment(htmlInput, '.html')).to.equal(expected);
  });
});
