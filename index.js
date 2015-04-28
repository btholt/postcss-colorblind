var helpers = require("postcss-message-helpers");
var colorblind = require('color-blind');
var hexRegEx = /^#(?:[0-9a-f]{3}){1,2}$/i;

module.exports = function plugin(method) {
  method = method ? method.toLowerCase().trim() : 'deuteranopia';

  if (typeof colorblind[method] !== 'function') {
    throw new Error('postcss-colorblind was given an invalid color transform: ' + method);
  }

  return function(style) {
    style.eachDecl(function transformDecl(decl) {
      helpers.try(function() {
        var stringArray = decl.value.toLowerCase().split(' ');
        var changed = stringArray.map(function(token) {
          return token.match(hexRegEx) ? colorblind[method](token) : token;
        });
        decl.value = changed.join(' ');
      }, decl.source);
    });
  };
};
