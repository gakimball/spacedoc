const Data = require('./data');

module.exports = {
  name: 'mock',
  itemName: 'value',
  group: 'group',
  parse: (value, config) => {
    return Promise.resolve(Data);
  },
  filter: item => {
    return item.private === true;
  },
  search: (item, link) => {
    return {
      name: item.value,
      type: item.group,
      description: item.value,
      link: `${link}#${item.value}`
    }
  },
  config: () => {
    return {}
  },
  helpers: {
    test: () => 'test'
  },
}
