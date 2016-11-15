var helpers = require("postcss-message-helpers");
var colorblind = require('color-blind');
var postcss = require('postcss');
var colorCreater = require('./src/color-transformer');

var name = 'postcss-colorblind';

module.exports = postcss.plugin(name, function(opts) {
  opts = opts || {};
  method = opts.method ? opts.method.toLowerCase().trim() : 'deuteranopia';
  if (typeof colorblind[method] !== 'function') {
    throw new Error(name + ' was given an invalid color transform: ' + method);
  }
  return function(style) {
    style.walkDecls(function transformDecl(decl) {
      helpers.try(function() {
        var stringArray = decl.value.toLowerCase().split(' ');
        var changed = stringArray.map(function(token) {
          return colorCreater.transform(token, method);
        });
        decl.value = changed.join(' ');
      }, decl.source);
    });
  };
});
