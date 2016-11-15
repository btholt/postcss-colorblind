var helpers = require("postcss-message-helpers");
var colorblind = require('color-blind');
var postcss = require('postcss');
var colorTransformer = require('./src/color-transformer');

var space = postcss.list.space;

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
        var stringArray = space(decl.value);
        var changed = stringArray.map(function(token) {
          return colorTransformer(token, method);
        });
        decl.value = changed.join(' ');
      }, decl.source);
    });
  };
});
