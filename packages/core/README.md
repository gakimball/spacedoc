# @spacedoc/core

> Core parser for Spacedoc

[![Travis](https://img.shields.io/travis/gakimball/spacedoc.svg?maxAge=2592000)](https://travis-ci.org/gakimball/spacedoc) [![npm](https://img.shields.io/npm/v/spacedoc.svg?maxAge=2592000)](https://www.npmjs.com/package/spacedoc)

## Installation

```bash
npm install @spacedoc/core
```

## Usage

```js
const spacedoc = require('@spacedoc/core');

const parse = spacedoc({
  adapters: ['js', 'sass'],
  pages: 'docs',
  docs: [
    'src/js',
    'src/scss'
  ]
});

parse().then(data => {
  console.log(data);
});
```

## API

### spacedoc([options])

Create a Spacedoc parser.

- **options** (Object): parser settings.
  - **adapters** (Array of Strings): adapters to use. An adapter can be:
    - `[name]`, where `spacedoc-[name]` is the name of an installed module.
    - `[path]`, where `[path]` is a relative path to a module.
  - **pages** (String): folder containing documentation pages as Markdown (`.md`) files.
  - **docs** (Array of Strings): folders containing code to be documented.

Returns a parsing function.

#### parse()

Parse documentation and return any pages and doclets found. Returns a Promise containing a data object with these properties:

- **pages** (Array of Objects): documentation pages.
- **docs** (Array of Objects): doclets.

## License

MIT &copy; [Geoff Kimball](http://geoffkimball.com)
