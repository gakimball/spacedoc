# Spacedoc

A fancy documentation generator that can mash up documentation from multiple sources, such as [SassDoc](http://sassdoc.com/) and [JSDoc](http://usejsdoc.org/). Spacedoc was originally forked from [Supercollider](https://github.com/zurb/supercollider), the documentation tool used by the [Foundation](https://github.com/zurb/foundation-sites) family of frameworks.

## Features

- Combines [Markdown, SassDoc data, and JSDoc data](packages/spacedoc/_docs/docs/overview.md) into compiled HTML pages.
- Supports [custom Markdown and Pug](packages/spacedoc/_docs/docs/api.md) instances.
- Can generate a [search result list](packages/spacedoc/_docs/docs/search.md) out of documentation items.
- Can be [extended](packages/spacedoc/_docs/docs/adapters.md) to support other documentation generators.

## Documentation

Read the [overview section](packages/spacedoc/_docs/docs/overview.md) of the documentation to get an overview of how Spacedoc works. Then check out the [full documentation](packages/spacedoc/_docs).

## Local Development

```
git clone https://github.com/spacedoc/spacedoc
cd Spacedoc
npm run bootstrap
npm test
```

### Repo Structure

Spacedoc is a monorepo powered by [Lerna](https://github.com/lerna/lerna). This means all of the library's core packages are maintained here in the same repository, and published as separate modules using the same version numbers.

The packages include:

- `spacedoc`: core library.
- `spacedoc-helpers`: template helper functions.
- `spacedoc-js`: JSDoc adapter.
- `spacedoc-sass`: SassDoc adapter.
