var onecolor = require('onecolor');
var colorblind = require('color-blind');
var hsl = require('hsl-regex');
var hsla = require('hsla-regex');
var rgb = require('rgb-regex');
var rgba = require('rgba-regex');
var hex = require('hex-color-regex');
var names = require('css-color-names');

var supportedMethods = {
  'hex': 'hex',
  'named': 'hex',
  'rgb': 'css',
  'hsl': 'css',
  'rgba': 'cssa',
  'hsla': 'cssa'
};

module.exports = { 
  transform: function(inputToken, method) {
    var obj = { original: inputToken };
    var token = inputToken.toLowerCase();
    var ans, type;

    if (hsl().test(token)) {
      type = 'hsl';
    }
    else if (hsla().test(token)) {
      type = 'hsla';
    }
    else if (rgb().test(token)) {
      type = 'rgb';
    }
    else if (rgba().test(token)) {
      type = 'rgba';
    }
    else if (hex().test(token)) {
      type = 'hex';
    }
    else if (names[token]) {
      type = 'named';
    }
    else {
      return inputToken;
    }
    return this._applyColorTransform(token, type, method);
  },
  _applyColorTransform: function(color, type, colorblindTransform) {
    var preTransformColor = onecolor(color);
    var colorblindHex = colorblind[colorblindTransform](preTransformColor.hex());
    var postTransformColor = onecolor(colorblindHex);
    var opacityAppliedColor = postTransformColor.alpha(preTransformColor.alpha());
    return opacityAppliedColor[supportedMethods[type]]();
  }
};
