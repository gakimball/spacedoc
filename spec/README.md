# Doclet Spec

This folder contains the spec for a doclet object.

A *doclet* represents a unit within a programming language. Depending on the language, this could be a variable, function, class, mixin, constant, endpoint, or anything else supported by a documentation generator.

Every documentation generator formats the data of a doclet differently. Spacedoc's adapters unify these disparate data structures into one, which conforms to the JSON schema in `doclet.json`. This allows a single template to render documentation from any Spacedoc-compatible generator.

For example JSDoc objects store the name of a doclet under `name`, while SassDoc objects store the name under `context.name`. In a Spacedoc object, it's always `name`, no matter what documentation generator the doclet came from.

## How to Read the Schema

The spec for doclet objects is written as a JSON schema, which dictates the structure of the object, in terms of valid property types, property structure, and so on.

Every property has a `type`, such as `object`, `string`, or `number`. Within objects, the `properties` property lists every property the object can contain. (Confused yet?) For arrays, the `item` property describes what kind of values should go in the array.

Each field has a `description` explaining what it's for. Lastly, some objects list necessary properties under `required`.
