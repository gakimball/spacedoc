## Adapters

An *adapter* is a module that pulls information from a documentation generator and adds it to the data of a page. When a page references an adapter in its Front Matter, the adapter goes and gets the right documentation data for the page. That data is then used in the template that renders the final docs page.

## Built-in Adapters

Spacedoc has two built-in adapters: `sass`, which uses SassDoc, and `js`, which uses JSDoc. You can create your own by calling the `adapter()` method on Spacedoc. An adapter is a class with various parsing methods.

## Custom Adapters

You can write your own adapter for any documentation generator&mdash;or any data source at all.

An adapter is a static class that hooks into a documentation generator to fetch, organize, and filter doclets associated with a page. This data is passed to the Pug template used to render the page's documentation.

```js
class Parser {
  static parse(value, config) {}
  static group(item) {}
  static filter(item) {}
  static search(items, link) {}
  static config() {}
}
```

## Adapter API

### parse(value[, config])

Parse information using a documentation generator.

- **value** (\*): page-specific parameter for the parser. This is almost always a path to a file for the plugin to parse. For example, the SassDoc parser is looking for a single file path (a string), or a series of file paths (an array of strings), from which it will parse documentation info.
- **config** (Object): developer-supplied configuration options. If your adapter is customizable, those options will be in this object.

Must return a Promise that resolves to an array of objects. Most documentation generators output a flat list of doclets by default.

### group(item)

Return the type of a doclet. Because most documentation parsers give us a flat list of objects, we need to group them together by category. This function returns what the cateogry is, given a single instance of an item.

- **item** (Object): item being analyzed.

Returns a string, usually.

### filter(item)

Return if an item should be filtered out. Use this to find items marked with `@private` and such, and remove them from the list.

- **item** (Object): item being analyzed.

Must return a boolean.

### search(item, link)

**This method is optional.** Return a search result for a given item. This function is used when `Spacedoc.buildSearch()` is called. Each documentation item gets its own search result.

- **item** (Object): item being analyzed.
- **link** (String): path to the HTML file this item is contained in.

The object returned should have this format:

- **name** (String): name of the item.
- **description** (String): description of the item.
- **type** (String): type of the item.
- **link** (String): link to go to when the item is clicked on.

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

### config()

**This method is optional.** Return the default configuration settings for this adapter.

Must return an object.

## Example

Here's what the built-in SassDoc adapter looks like.

```js
const escapeHTML = require('escape-html');
const sassdoc = require('sassdoc');

class SassDocParser {
  static parse(value, config) {
    return sassdoc.parse(value, config).then(function(data) {
      return data;
    });
  }

  static group(item) {
    return item.context.type;
  }

  static filter(item) {
    return item.access === 'private'
  }

  static search(item, link) {
    return {
      name: item.context.name,
      type: `sass ${item.context.type}`,
      description: escapeHTML(item.description.replace(/(\n|`)/, '')),
      link: `${link}#sass_${item.context.type}_${item.context.name}`
    }
  }

  static config() {
    return {
      verbose: false
    }
  }
}

module.exports = SassDocParser;
```

## Next

[Read more about how search result generation works.](search.md)
