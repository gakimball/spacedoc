const escapeHTML = require('escape-html');
const jsdoc = require('jsdoc-api');

module.exports = {
  name: 'js',
  itemName: 'name',
  group: 'kind',
  parse: (value, config) => jsdoc.explain({ files: value }).then(data => data),
  parent: item => item.memberof,
  filter: item => item.undocumented === true || item.access === 'private',
  search: (item, link) => ({
    name: item.name,
    type: `js ${item.kind}`,
    description: escapeHTML((item.description || '').replace('\n', '')),
    link: `${link}#js_${item.kind}_${item.name}`,
  }),
  helpers: require('./helpers'),
}
