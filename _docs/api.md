# API Reference

### Spacedoc(options)

Parses and builds documentation. Returns a Node stream of Vinyl files.

- **options** (Object):
  - **incremental** (Boolean): enable incremental compiling. `false` by default.

### Spacedoc.config(options)

Sets configuration settings.

- **options** (Object):
  - **adapters** (Array of Strings): adapters to load. See [Adapters](adapters.md) to see how they're loaded.
  - **template** (String or Function): template(s) to use when rendering pages. This option has a number of possible values:
    - Omit to use the built-in template, which has two layouts: `default` and `blank`.
    - Set a path to a folder to load all `.pug` files in that folder. At least one file must be named `default.pug`.
    - Set a path to a `.pug` file, and all pages will use that same template to render.
    - Set a function that returns a string given an object of data. This allows you to use another templating language if you wish.
  - **src** (String or Array): a glob of files to process. Each file is a component, and can be attached to zero or more adapters to documentation generators. *Omit this when using Spacedoc with Gulp.*
  - **dest** (String): file path to write the finished HTML to. *Omit this when using Spacedoc with Gulp.*
  - **marked** (Object): a custom instance of Marked to use when parsing the markdown of your documentation pages. This allows you to pass in custom rendering methods.
    - This value can also be `false`, which disables Markdown parsing on the page body altogether. Use this to create Markdown-based documentation instead of HTML-based.
  - **extension** (String): extension to change files to after processing. The default is `html`.
  - **silent** (Boolean): enable/disable console logging as pages are processed. The default is `true`.
  - **pageRoot** (String): path to the common folder that every source page sits in. This is only necessary if you're generating [search results](search.md).
  - **data** (Object): extra data to add to the Pug instance.
  - **search** (Object): search settings.
    - **extra** (String): file path to a JSON or YML file with an array of search results. These will be loaded and added as-is to the search result list.
    - **sort** (Array): an array of strings representing sort criteria. The results list can be sorted by the `type` property on each result.
    - **pageTypes** (Object): custom tags for search result items.

### Spacedoc.buildSearch(outFile, cb)

Generates a JSON file of search results using the current set of parsed data.

- **outFile** (String): location to write to disk.

Returns a promise.

### Spacedoc.tree

An array containing all of the processed data from the last time Spacedoc ran. Each item in the array is a page that was processed.

## Next

- [Read how documentation adapters work, and how to write your own.](adapters.md)
- [Read how to generate a search result list from processed data.](search.md)
