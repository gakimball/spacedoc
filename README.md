# Spacedoc

A fancy documentation generator that can mash up documentation from multiple sources, such as [SassDoc](http://sassdoc.com/) and [JSDoc](http://usejsdoc.org/). Spacedoc was originally forked from [Supercollider](https://github.com/zurb/supercollider), the documentation tool used by the [Foundation](https://github.com/zurb/foundation-sites) family of frameworks.

## Features

- Combines [Markdown, SassDoc data, and JSDoc data](_docs/overview.md) into compiled HTML pages.
- Supports [custom Markdown and Pug](_docs/api.md) instances.
- Can generate a [search result list](_docs/search.md) out of documentation items.
- Can be [extended](_docs/adapters.md) to support other documentation generators.

## Documentation

Read the [overview section](_docs/overview.md) of the documentation to get an overview of how Spacedoc works. Then check out the [full documentation](_docs).

## Local Development

```
git clone https://github.com/spacedoc/spacedoc
cd Spacedoc
npm install
npm test
```
