var helpers = require('postcss-message-helpers');
var valueParser = require('postcss-value-parser');
var colorblind = require('color-blind');
var postcss = require('postcss');
var Jimp = require('jimp');
var colorTransformer = require('./src/color-transformer');

var stringify = valueParser.stringify;

var name = 'postcss-colorblind';

function getBase64Data(url, method) {
  return new Promise(function(resolve, reject) {
    return Jimp.read(url).then(function(image) {
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, index) {
          var r = this.bitmap.data[index    ];
          var g = this.bitmap.data[index + 1];
          var b = this.bitmap.data[index + 2];
          var a = this.bitmap.data[index + 3];

          var result = colorblind[method]('rgba(' + [r, g, b, a].join(',') + ')', true);

          this.bitmap.data[index    ] = result.R;
          this.bitmap.data[index + 1] = result.G;
          this.bitmap.data[index + 2] = result.B;
      });

      image.getBase64(Jimp.AUTO, function(err, data) {
          if (err) {
            return reject(err);
          }
          return resolve(data);
      });
    }).catch(function() {
      resolve(url);
    });
  });
}

function transformValue(decl, method) {
  var promises = [];
  var cache = '';
  helpers.try(function() {
    cache = valueParser(decl.value).walk(function(node) {
      if (node.type === 'function') {
        var toLower = node.value.toLowerCase();
        if (~['hsl', 'hsla', 'rgb', 'rgba'].indexOf(toLower)) {
          var value = colorTransformer(stringify(node), method);
          node.type = 'word';
          node.value = value;
          return;
        }
        if (toLower === 'url') {
          promises.push(
            getBase64Data(node.nodes[0].value, method).then(function(dataUrl) {
              node.nodes[0].value = dataUrl;
            })
          );
        }
      } else if (node.type === 'word') {
        node.value = colorTransformer(node.value, method);
      }
    });
  }, decl.source);

  return Promise.all(promises).then(function() {
    decl.value = cache.toString();
  });
}

module.exports = postcss.plugin(name, function(opts) {
  opts = opts || {};
  method = opts.method ? opts.method.toLowerCase().trim() : 'deuteranopia';
  if (typeof colorblind[method] !== 'function') {
    throw new Error(name + ' was given an invalid color transform: ' + method);
  }
  return function(style) {
    return new Promise(function(resolve, reject) {
      var promises = [];
      style.walkDecls(function transformDecl(decl) {
        return promises.push(transformValue(decl, method));
      });
      return Promise.all(promises).then(resolve, reject);
    });
  };
});
