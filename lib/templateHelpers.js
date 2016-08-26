const hljs = require('highlight.js');
const marked = require('marked');

module.exports = {
  title: title,
  highlight: highlight,
  markdown: markdown
}

function title(text = '') {
  return text[0].toUpperCase() + text.slice(1);
}

function highlight(code = '') {
  return hljs.highlightAuto(code, ['html', 'css', 'sass', 'javascript']).value;
}

function markdown(text = '') {
  return marked(text);
}
