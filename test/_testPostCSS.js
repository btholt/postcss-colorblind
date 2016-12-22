var postcss = require('postcss');
var getProcessor = require('./_getProcessor');

module.exports = function testPostCSS (t, input, output, options) {
  return getProcessor(options).process(input).then(function(result) {
    t.deepEqual(result.css, output);
  });
}
