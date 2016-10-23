# spacedoc-json

> JSON Schema adapter for Spacedoc

[![npm](https://img.shields.io/npm/v/spacedoc-json.svg?maxAge=2592000)]()

Parses information from JSON files formatted as [JSON Schema](http://json-schema.org). For use with [Spacedoc](https://github.com/spacedoc/spacedoc), a documentation generator.

```bash
npm install spacedoc-json
```

## Contents

- [Usage](#usage)
- [Support](#support)
- [Other Adapters](#other-adapters)
- [License](#license)

## Usage

`spacedoc-json` requires a working Spacedoc setup. Add `json` to your Spacedoc config like so:

```js
Spacedoc.config({
  adapters: ['json']
});
```

Or in `spacedoc.yml` in your project root:

```yml
adapters:
  - json
```

In pages that require JavaScript documentation, add `json` to the list of `docs` in the page's Front Matter. The value should be a string path to the JSON value, relative to the working directory.

```md
---
title: Spec
docs:
  json: spec/schema.json
---
```

## Support

`spacedoc-json` supports these features of JSON schema:

- `title`
- `description`
- `type`
- `properties`
- `required`
- `items`

## Other Adapters

- [`spacedoc-sass`](htts://npmjs.com/package/spacedoc-sass): SassDoc adapter
- [`spacedoc-js`](htts://npmjs.com/package/spacedoc-js): JSDoc adapter

## License

MIT &copy; [Geoff Kimball](http://geoffkimball.com)
