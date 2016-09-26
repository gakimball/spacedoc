## Adapters

An *adapter* is a module that pulls information from a documentation generator and adds it to the data of a page. When a page references an adapter in its Front Matter, the adapter goes and gets the right documentation data for the page. That data is then used in the template that renders the final docs page.

Adapters are set with the `adapters` option in `Spacedoc.config()`, where `adapters` is an array of names of adapters. When you call the function, it will first look for an installed package called `spacedoc-[name]`. If that doesn't exist, then it will try to `require()` a module relative to the current working directory.

If you have a custom adapter in the folder `lib/adapter`, you can call:

```js
Spacedoc.config({
  adapters: ['sass', 'lib/adapter']
});
```

## Custom Adapters

You can write your own adapter for any documentation generator&mdash;or any data source at all.

An adapter is housed in a folder with an `index.js` file containing the parser class, and a template at `template/index.pug` to render the HTML of the documentation.

```
- adapter/
--- index.js
--- template/
----- index.pug
```

### Adapter Object

The adapter object hooks into a documentation generator to fetch, organize, and filter doclets associated with a page. This data is passed to the Pug template used to render the page's documentation.

```js
module.exports = {
  name: 'adapter',
  itemName: 'name',
  group: 'type',
  parse: (value, config) => parseStuff(value, config).then(res => res),
  filter: item => item.private === true,
  search: (item, link) => ({
    name: item.name,
    type: item.type,
    description: item.description,
    link: `${link}#${item.name}`,
  }),
  config: () => ({}),
  helpers: {},
}
```

Every property except `helpers` is required.

- **name** (String): adapter name.
- **itemName** (String or Array of Strings): object path to get the name of an item.
- **group** (String or Array of Strings): object path to get the group/type of an item.
- **parse** (Function): function that fetches documentation data and returns a Promise containing an array of objects. Most documentation generators output a flat list of doclets by default. The function takes these parameters:
  - **value** (\*): page-specific parameter for the parser. This is almost always a path to a file for the plugin to parse. For example, the SassDoc parser is looking for a single file path (a string), or a series of file paths (an array of strings), from which it will parse documentation info.
  - **config** (Object): developer-supplied configuration options. If your adapter is customizable, those options will be in this object.
- **filter** (Function): function that filters out private doclets and returns `true` if the doclet should be kept, or `false` if the doclet should be filtered out. The function takes these parameters:
  - **item** (Object): item being analyzed.
- **search** (Function): generate a search result for a doclet. This function is used when `Spacedoc.buildSearch()` is called. Each doclet gets its own search result.
  - The function takes these parameters:
    - **item** (Object): item being analyzed.
    - **link** (String): path to the HTML file this item is contained in.
  - The object returned should have this format. See [Example Search Result](#example-search-result) below for an example.
    - **name** (String): name of the item.
    - **description** (String): description of the item.
    - **type** (String): type of the item.
    - **link** (String): link to go to when the item is clicked on.
- **config** (Function): return the adapter's default configuration settings.
- **helpers** (Object of Functions): functions to pass to the adapter's Pug template. They're made available in the `helpers` namespace.

## Example

Here's what the built-in SassDoc adapter looks like.

```js
const escapeHTML = require('escape-html');
const path = require('path');
const sassdoc = require('sassdoc');

module.exports = {
  name: 'sass',
  itemName: ['context', 'name'],
  group: ['context', 'type'],
  parse: (value, config) => sassdoc.parse(value, config).then(data => data),
  filter: item => item.access === 'private',
  search: (item, link) => ({
    name: item.context.name,
    type: `sass ${item.context.type}`,
    description: escapeHTML(item.description.replace(/(\n|`)/, '')),
    link: `${link}#sass_${item.context.type}_${item.context.name}`,
  }),
  config: () => ({
    verbose: false
  }),
  helpers: require('./helpers'),
}
```

### Example Search Result

Here's an example from the SassDoc parser. A few things to note:

- `type` is prefixed with the name of the language. This is useful because you might have, say, Sass variables, JavaScript variables, Ruby variables, and so on.
- `link` is a combination of the page link, and then a hash that goes to a specific section of the page, derived from the type and name of the item.

```js
{
  name: item.context.name,
  type: `sass ${item.context.type}`,
  description: escapeHTML(item.description.replace(/(\n|`)/, '')),
  link: `${link}#sass_${item.context.type}_${item.context.name}`
}
```

## Next

[Read more about how search result generation works.](search.md)
