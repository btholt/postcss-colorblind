var path = require('path');
var test = require('ava');
var postcss = require('postcss');
var colorblindPlugin = require('..');
var colorTransformer = require('../src/color-transformer');
var colorNames = require('css-color-names');
var colorblind = require('color-blind');
var onecolor = require('onecolor');
var getProcessor = require('./_getProcessor');
var testPostCSS = require('./_testPostCSS');
var getFixture = require('./_getFixture');

function testColorMutation (t, color, method) {
  if (!method) {
    method = 'deuteranopia';
  }
  return testPostCSS(
    t,
    getFixture(color),
    getFixture(colorblind[method.toLowerCase().trim()](color)),
    {method: method}
  );
}

['#123', '#000', '#fff', '#f06d06'].forEach(function(hex, index) {
  test(
    'should transform hex (' + (index + 1) + ')',
    testColorMutation,
    hex
  );
});

[{
  from: '#1234',
  hex: '#123',
  alpha: '0.27',
}, {
  from: '#9344ABCD',
  hex: '#9344AB',
  alpha: '0.8',
}, {
  from: '#FFFFFFFF',
  hex: '#FFFFFF',
  alpha: '1',
}, {
  from: '#0000',
  hex: '#000',
  alpha: '0',
}, {
  from: 'rgba(30, 50, 200, 1)',
  hex: '#1E32C8',
  alpha: 1,
}, {
  from: 'rgba(100, 200, 0, 0)',
  hex: '#64C800',
  alpha: 0,
}, {
  from: 'rgba(150,50,50,.4)',
  hex: '#963232',
  alpha: .4,
}, {
  from: 'hsla(30, 50%, 50%, 1)',
  hex: '#BF8040',
  alpha: 1,
}, {
  from: 'hsla(100, 80%, 30%, 0)',
  hex: '#388A0F',
  alpha: 0,
}, {
  from: 'hsla(150,50%,50%,.4)',
  hex: '#40BF80',
  alpha: .4,
}].forEach(function(map, index) {
  test(
    `should transform ${map.from} (${index + 1})`,
    testPostCSS,
    getFixture(map.from),
    getFixture(onecolor(colorblind.deuteranopia(map.hex)).alpha(map.alpha).cssa())
  );
});

var keywordMap = {
  mediumSeaGreen: '#3CB371',
  PapayaWhip: '#FFEFD5',
  thistle: '#D8BFD8',
  BlanchedAlmond: '#FFEBCD',
  rebeccaPurple: '#639',
};

Object.keys(keywordMap).forEach(function(keyword, index) {
  var hex = keywordMap[keyword];
  test(
    'should transform named color (' + (index + 1) + ')',
    testColorMutation,
    keyword
  );
});

var hexRgbMap = {
  '#1E32C8': 'rgb(30, 50, 200)',
  '#64C800': 'rgb(100, 200, 0)',
  '#963232': 'rgb(150,50,50)',
};

Object.keys(hexRgbMap).forEach(function(hex, index) {
  var rgb = hexRgbMap[hex];
  test(
    'should transform rgb (' + (index + 1) + ')',
    testPostCSS,
    getFixture(rgb),
    getFixture(onecolor(colorblind.deuteranopia(hex)).css())
  );
});

var hexHslMap = {
  '#BF8040': 'hsl(30, 50%, 50%)',
  '#388A0F': 'hsl(100, 80%, 30%)',
  '#40BF80': 'hsl(150,50%,50%)',
};

Object.keys(hexHslMap).forEach(function(hex, index) {
  var hsl = hexHslMap[hex];
  test(
    'should transform hsl (' + (index + 1) + ')',
    testPostCSS,
    getFixture(hsl),
    getFixture(onecolor(colorblind.deuteranopia(hex)).css())
  );
});

test(
  'should do a simple hex deuteranopia transform',
  testColorMutation,
  `#FFCC00`
);

test(
  'should do a simple hex achromatopsia transform',
  testColorMutation,
  `#D929E2`,
  'achromatopsia'
);

test(
  'should do a simple named color deuteranopia transform',
  testPostCSS,
  `.some-color { border: 3px red solid; font-size: 12px }`,
  `.some-color { border: 3px ${colorblind.deuteranopia(colorNames.red)} solid; font-size: 12px }`
);

test(
  'should do a multi tritanopia transform',
  testPostCSS,
  `.some-color { border: 3px #D929E2 solid; color: lime }`,
  `.some-color { border: 3px ${colorblind.tritanopia('#D929E2')} solid; color: ${colorblind.tritanopia('lime')} }`,
  {method: 'tritanopia'}
);

test(
  'should work inside gradients',
  testPostCSS,
  `.some-color { background: linear-gradient(#000000, hsla(120, 30%, 80%, .8)) }`,
  `.some-color { background: linear-gradient(#000000, ${colorTransformer('hsla(120, 30%, 80%, .8)', 'deuteranopia')}) }`
);

test('should process images and yield an inlined data url', t => {
  return getProcessor().process(`a{background:url(${path.join(__dirname, 'fixture.jpg')})}`).then(function(result) {
    t.deepEqual(result.css.indexOf('data:image/jpeg;base64'), 17);
  });
});

test(
  'should handle weird capitalization of method names',
  testColorMutation,
  '#FFCC00',
  'DEuTerAnopiA'
);

test(
  'should handle weird whitespace',
  testColorMutation,
  '#FFCC00',
  ' deuteranopia      '
);

test(
  'should handle capitalized color names',
  testColorMutation,
  'ALICebLuE'
);

test('should throw an error on a bad method name', function(t) {
  t.throws(function () {
    return testPostCSS(t, 'h1{}', 'h1{}', {method:'bad method name'})
  });
});
