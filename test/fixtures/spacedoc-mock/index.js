const Data = require('./data');

module.exports = class MockAdapter {
  static name() {
    return 'mock';
  }

  static itemName() {
    return 'value';
  }

  static group() {
    return 'group';
  }

  static parse(value, config) {
    return Promise.resolve(Data);
  }

  static filter(item) {
    return item.private === true;
  }

  static search(item, link) {
    return {
      name: item.value,
      type: item.group,
      description: item.value,
      link: `${link}#${item.value}`
    }
  }

  static config() {
    return {}
  }
}

module.exports.helpers = {
  test: () => 'test'
}
