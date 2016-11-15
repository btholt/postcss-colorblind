var helpers = require('postcss-message-helpers');
var valueParser = require('postcss-value-parser');
var colorblind = require('color-blind');
var postcss = require('postcss');
var colorTransformer = require('./src/color-transformer');

var stringify = valueParser.stringify;

var name = 'postcss-colorblind';

function transformValue(decl, method) {
  helpers.try(function() {
    decl.value = valueParser(decl.value).walk(function(node) {
      if (node.type === 'function' && ~['hsl', 'hsla', 'rgb', 'rgba'].indexOf(node.value.toLowerCase())) {
        var value = colorTransformer(stringify(node), method);
        node.type = 'word';
        node.value = value;
      } else if (node.type === 'word') {
        node.value = colorTransformer(node.value, method);
      }
    }).toString();
  }, decl.source);
}

module.exports = postcss.plugin(name, function(opts) {
  opts = opts || {};
  method = opts.method ? opts.method.toLowerCase().trim() : 'deuteranopia';
  if (typeof colorblind[method] !== 'function') {
    throw new Error(name + ' was given an invalid color transform: ' + method);
  }
  return function(style) {
    style.walkDecls(function transformDecl(decl) {
      return transformValue(decl, method);
    });
  };
});
