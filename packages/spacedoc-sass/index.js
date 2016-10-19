const escapeHTML = require('escape-html');
const path = require('path');
const sassdoc = require('sassdoc');

module.exports = {
  name: 'sass',
  itemName: ['context', 'name'],
  group: ['context', 'type'],
  parse: (value, config) => sassdoc.parse(value, config).then(data => data),
  filter: item => item.access === 'private',
  search: (item, link) => ({
    name: item.context.name,
    type: `sass ${item.context.type}`,
    description: escapeHTML(item.description.replace(/(\n|`)/, '')),
    link: `${link}#sass_${item.context.type}_${item.context.name}`,
  }),
  config: () => ({
    verbose: false
  }),
  helpers: require('./helpers'),
}
