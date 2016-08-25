## Adapters

An adapter is a function that hooks into a documentation generator to fetch data associated with a component. This data is passed to the Handlebars template used to render the component's documentation.

Adapters can have an optional configuration object (defined on `module.exports.config`), which can be used to allow developers to pass settings to the specific docs generator for that adapter.

An adapter function accepts two parameters:

- **value** (Mixed): page-specific configuration values. This could be any YAML-compatible value, but it's often a string.
- **config** (Object): global configuration values. This is the adapter's defaults, extended by the developer's own settings.

Spacedoc has two built-in adapters: `sass`, which uses SassDoc, and `js`, which uses JSDoc. You can create your own by calling the `adapter()` method on Spacedoc. An adapter is an asynchronous function that returns a promise containing an object of parsed data.

Here's what the built-in SassDoc adapter looks like.

```js
var sassdoc = require('sassdoc');

module.exports = function(value, config, cb) {
  return sassdoc.parse(value, config).then(function(data) {
    return processTree(data);
  });
}

module.exports.config = {
  verbose: false
}

function processTree(tree) {
  var sass = {};

  for (var i in tree) {
    var obj = tree[i];
    var group = obj.context.type

    if (!sass[group]) sass[group] = [];
    sass[group].push(obj);
  }

  return sass;
}
```

### Search Integration

Spacedoc can generate a JSON file of search results from the data it parses from pages. Each adapter exposes its own function to add its data to the results list. So the `sass` adapter converts SassDoc items into search results, `js` converts JSDoc items, and so on.

Search hooks are optional&mdash;if an adapter has no search function, those items simply won't be added to the final results list.

To add results hooks, export a item called `search` with a function:

```js
module.exports.search = function(items, link) {}
```

The function is given two parameters:

- **`items`** is an array of items extracted from a single page.
- **`link`** is the URL to the parent page. Since documentation items are grouped by page, the search results generated here will need to know the URL of that page. Most likely, a hash will be appended to the URL, to link to a sub-section of a page.

The function must return an array of results. These are appended to the master list of search results.

A search result is an object with this format:

```js
var result = {
  name: '$variable',
  type: 'sass variable',
  description: 'This is a variable.'
  link: 'page.html#variable'
}
```

## Next

[Read more about how search result generation works.](search.md)
