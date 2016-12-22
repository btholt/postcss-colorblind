var postcss = require('postcss');
var colorblind = require('..');

module.exports = function getProcessor (options) {
  return postcss(colorblind(options));
}
