/**
 * Parse a JSDoc `@example` annotation.
 * @param {String} example - Example contents.
 * @returns {Object} Formatted object containing example info.
 */
module.exports = example => {
  const match = example.match(/^<caption>(.+?)<\/caption>\n(.*)$/);

  // Example with caption
  if (match) {
    return {
      language: 'js',
      description: match[1],
      code: match[2]
    };
  }

  // Example with no caption
  return {
    language: 'js',
    code: example
  };
};
