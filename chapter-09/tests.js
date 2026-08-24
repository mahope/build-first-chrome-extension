// Copy htmlToMarkdown and stripTagsSafe here (or import them)
const assert = require('assert');

// Test cases
assert.strictEqual(
  htmlToMarkdown('<h1>Title</h1>').trim(),
  '# Title'
);

assert.strictEqual(
  htmlToMarkdown('<p>Hello <strong>world</strong></p>').trim(),
  'Hello **world**'
);

assert.strictEqual(
  htmlToMarkdown('<a href="https://x.com">link</a>').trim(),
  '[link](https://x.com)'
);

console.log('All tests passed!');
