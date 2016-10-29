---
title: Spacedoc Test
docs:
  js: packages/spacedoc-js/test/fixtures/*.js
  json: packages/spacedoc-json/test/fixtures/schema.json
  sass: packages/spacedoc-sass/test/fixtures/*.scss
---

This page pulls test fixtures from every Spacedoc adapter, so we can see how they look in the default template.

```html_example
<button type="button" class="button">Button</button>
```

```multi
    ```js
    const fs = require('fs');

    module.exports = function load(path) {
      return fs.readFileSync(path).toString();
    }
    ```

    ```ts
    import fs from 'fs';

    export default function load(path: string): string {
      return fs.readFileSync(path).toString();
    }
    ```
```
