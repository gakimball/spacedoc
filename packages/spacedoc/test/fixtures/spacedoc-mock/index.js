module.exports = () => Promise.resolve([{
  meta: {
    name: 'Thing',
    description: 'A thing',
    type: 'thing'
  }
}]);

module.exports.adapterName = 'mock';
