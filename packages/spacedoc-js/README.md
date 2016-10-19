# spacedoc-js

> SassDoc adapter for Spacedoc

[![Travis](https://img.shields.io/travis/spacedoc/js.svg?maxAge=2592000)]() [![npm](https://img.shields.io/npm/v/spacedoc-js.svg?maxAge=2592000)]()

Parses data from JavaScript files documented with [JSDoc](http://usejsdoc.com). For use with [Spacedoc](https://github.com/spacedoc/spacedoc), a documentation generator.

```bash
npm install spacedoc-js
```

## Contents

- [Usage](#usage)
- [Support](#support)
- [Other Adapters](#other-adapters)
- [License](#license)

## Usage

`spacedoc-js` requires a working Spacedoc setup. Add `js` to your Spacedoc config like so:

```js
Spacedoc.config({
  adapters: ['js']
});
```

Or in `spacedoc.yml` in your project root:

```yml
adapters:
  - js
```

In pages that require JavaScript documentation, add `js` to the list of `docs` in the page's Front Matter. The value of `js` can be:
  - A single file
  - A glob of files
  - An array with either of those things

```md
---
title: Modal
docs:
  js: js/modal.js
---
```

## Support

`spacedoc-js` supports all JSDoc types, which includes:

- `class`
- `constant`
- `event`
- `function`
- `module`
- `namespace`
- `typedef`

The plugin supports these annotations:

- `@access`
- `@deprecated`
- `@parameter`
- `@return`
- `@since`
- `@throw`
- `@todo`
- `@type`

## Other Adapters

- [`spacedoc-sass`](htts://github.com/spacedoc/sass): SassDoc adapter

## License

MIT &copy; [Geoff Kimball](http://geoffkimball.com)
