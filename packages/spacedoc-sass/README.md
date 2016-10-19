# spacedoc-sass

> SassDoc adapter for Spacedoc

[![Travis](https://img.shields.io/travis/spacedoc/sass.svg?maxAge=2592000)]() [![npm](https://img.shields.io/npm/v/spacedoc-sass.svg?maxAge=2592000)]()

Parses data from `.scss` files documented with [SassDoc](http://sassdoc.com). For use with [Spacedoc](https://github.com/spacedoc/spacedoc), a documentation generator.

```bash
npm install spacedoc-sass
```

## Contents

- [Usage](#usage)
- [Support](#support)
- [Other Adapters](#other-adapters)
- [License](#license)

## Usage

`spacedoc-sass` requires a working Spacedoc setup. Add `sass` to your Spacedoc config like so:

```js
Spacedoc.config({
  adapters: ['sass']
});
```

Or in `spacedoc.yml` in your project root:

```yml
adapters:
  - sass
```

In pages that require Sass documentation, add `sass` to the list of `docs` in the page's Front Matter. The value of `sass` can be:
  - A single file
  - A glob of files
  - An array with either of those things

```md
---
title: Button
docs:
  sass: scss/components/\_button.scss
---
```

## Support

`spacedoc-sass` supports all SassDoc types, which includes:

- `variable`
- `function`
- `mixin`
- `placeholder`

The plugin supports these annotations:

- `@access`
- `@content`
- `@deprecated`
- `@example`
- `@output`
- `@parameter`,
- `@property`
- `@return`
- `@since`
- `@throw`
- `@todo`
- `@type`

## Other Adapters

- [`spacedoc-js`](htts://github.com/spacedoc/js): JSDoc adapter

## License

MIT &copy; [Geoff Kimball](http://geoffkimball.com)
