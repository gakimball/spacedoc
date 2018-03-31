module.exports = {
  name: 'fixture',
  extensions: ['json'],
  parse: () => Promise.resolve([{
    meta: {
      name: 'Thing',
      description: 'A thing',
      type: 'thing'
    }
  }])
};
