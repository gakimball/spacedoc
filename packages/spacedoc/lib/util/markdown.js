const hljs = require('highlight.js');

module.exports = require('markdown-it')({
  highlight: (code, lang) => (lang ? hljs.highlight(lang, code) : hljs.highlightAuto(code)).value,
});
