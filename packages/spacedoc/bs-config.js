module.exports = {
  injectChanges: false,
  files: ['./docs/**/*'],
  watchOptions: {
    "ignored": 'node_modules',
  },
  server: {
    baseDir: './docs',
    index: 'index.html',
  },
}
