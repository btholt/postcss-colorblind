var onecolor = require('onecolor');
var colorblind = require('color-blind');
var hsl = require('hsl-regex');
var hsla = require('hsla-regex');
var rgb = require('rgb-regex');
var rgba = require('rgba-regex');
var hex = require('hex-color-regex');
var hexa = require('hexa-color-regex');
var names = require('css-color-names');

var supportedMethods = {
  hex: 'hex',
  hexa: 'cssa',
  named: 'hex',
  rgb: 'css',
  hsl: 'css',
  rgba: 'cssa',
  hsla: 'cssa'
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
    else if (hex({strict:true}).test(token)) {
      type = 'hex';
    }
    else if (hexa({strict:true}).test(token)) {
      type = 'hexa';
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
    var preTransformColor;
    var opacity;
    if (type === 'hexa') {
      var hexaObject = this._separateHexa(color);
      preTransformColor = onecolor(hexaObject.hex);
      opacity = hexaObject.opacity;
    }
    else {
      preTransformColor = onecolor(color)
      opacity = preTransformColor.alpha();
    }
    var colorblindHex = colorblind[colorblindTransform](preTransformColor.hex());
    var postTransformColor = onecolor(colorblindHex);
    var opacityAppliedColor = postTransformColor.alpha(opacity);
    return opacityAppliedColor[supportedMethods[type]]();
  },
  _separateHexa(hexa) {
    var opacityHex;
    var colorHex;
    if (hexa.length > 5) {
      opacityHex = hexa.substr(-2);
      colorHex = hexa.substr(-8, 6);
    }
    else {
      opacityHex = hexa.substr(-1);
      opacityHex += opacityHex;
      colorHex = hexa.substr(-4, 3);
    }
    var opacity = .45; // TODO Magic convert hex to 0 to 1
    return { opacity: opacity, hex: colorHex };
  }
};
