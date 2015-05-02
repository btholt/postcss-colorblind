var helpers = require("postcss-message-helpers");
var colorblind = require('color-blind');
var postcss = require('postcss');
var colorCreater = require('./src/color-transformer');

var applyTransform = function(inputColorObj, method) {
  var newColorObj = onecolor(colorblind[method](inputColorObj.color.hex()));

  if (supportedMethods[inputColorObj.type]) {
    return newColorObj[supportedMethods[inputColorObj.type]]();
  }
  else {
    return newColorObj.hex();
  }
}

module.exports = postcss.plugin('colorblind', function(opts) {
  opts = opts || {};
  method = opts.method ? opts.method.toLowerCase().trim() : 'deuteranopia';
  if (typeof colorblind[method] !== 'function') {
    throw new Error('postcss-colorblind was given an invalid color transform: ' + method);
  }
  return function(style) {
    style.eachDecl(function transformDecl(decl) {
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
