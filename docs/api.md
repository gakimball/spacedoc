## API Reference

### config(options)

Sets configuration settings.

- **options** (Object):
  - **adapters** (Array of Strings): adapters to load. See [Adapters](adapters.md) to see how they're loaded.
  - **template** (String or Function): path to the Pug template to use for each component, or any function that takes an object of data and returns a string. If you want to use another templating language, you can pass in a pre-compiled template function.
  - **src** (String or Array): a glob of files to process. Each file is a component, and can be attached to zero or more adapters to documentation generators.
  - **dest** (String): file path to write the finished HTML to.
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

### init()

Parses and builds documentation. Returns a Node stream of Vinyl files.

### buildSearch(outFile, cb)

Generates a JSON file of search results using the current set of parsed data.

- **outFile** (String): location to write to disk.

Returns a promise.

### tree

An array containing all of the processed data from the last time Spacedoc ran. Each item in the array is a page that was processed.

## Next

- [Read how documentation adapters work, and how to write your own.](adapters.md)
- [Read how to generate a search result list from processed data.](search.md)
