var path = require('path');
var test = require('ava');
var postcss = require('postcss');
var colorblindPlugin = require('..');
var colorTransformer = require('../src/color-transformer');
var colorNames = require('css-color-names');
var colorblind = require('color-blind');
var onecolor = require('onecolor');

function getProcessor (options) {
  return postcss(colorblindPlugin(options));
}

function testPostCSS (t, input, output, options) {
  return getProcessor(options).process(input).then(function(result) {
    t.deepEqual(result.css, output);
  });
}

function testPassthrough (t, input, options) {
  return testPostCSS(t, input, input, options);
}

function getFixture (color) {
  return `.some-color { color: ${color}; }`;
}

function testColorMutation (t, color, method) {
  if (!method) {
    method = 'deuteranopia';
  }
  return testPostCSS(
    t,
    getFixture(color),
    getFixture(colorblind[method](color)),
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
  hexa: '#1234',
  hex: '#123',
  opacity: '0.27',
}, {
  hexa: '#9344ABCD',
  hex: '#9344AB',
  opacity: '0.8',
}, {
  hexa: '#FFFFFFFF',
  hex: '#FFFFFF',
  opacity: '1',
}, {
  hexa: '#0000',
  hex: '#000',
  opacity: '0',
}].forEach(function(map, index) {
  test(
    'should transform hexa (' + (index + 1) + ')',
    testPostCSS,
    getFixture(map.hexa),
    getFixture(onecolor(colorblind.deuteranopia(map.hex)).alpha(map.opacity).cssa())
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

[{
  rgb: 'rgba(30, 50, 200, 1)',
  hex: '#1E32C8',
  alpha: 1,
}, {
  rgb: 'rgba(100, 200, 0, 0)',
  hex: '#64C800',
  alpha: 0,
}, {
  rgb: 'rgba(150,50,50,.4)',
  hex: '#963232',
  alpha: .4,
}].forEach(function(map, index) {
  test(
    'should transform rgba (' + (index + 1) + ')',
    testPostCSS,
    getFixture(map.rgb),
    getFixture(onecolor(colorblind.deuteranopia(map.hex)).alpha(map.alpha).cssa())
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

[{
  hsl: 'hsla(30, 50%, 50%, 1)',
  hex: '#BF8040',
  alpha: 1,
}, {
  hsl: 'hsla(100, 80%, 30%, 0)',
  hex: '#388A0F',
  alpha: 0,
}, {
  hsl: 'hsla(150,50%,50%,.4)',
  hex: '#40BF80',
  alpha: .4,
}].forEach(function(map, index) {
  test(
    'should transform hsla (' + (index + 1) + ')',
    testPostCSS,
    getFixture(map.hsl),
    getFixture(onecolor(colorblind.deuteranopia(map.hex)).alpha(map.alpha).cssa())
  );
});

[
  '3px',
  'not a color',
  'url(http://www.bluehost.com/index.html#f06d06)'
].forEach(function(value) {
  test(
    'should not transform ' + value,
    testPassthrough,
    getFixture(value)
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
  'should do a rgb transform',
  testPostCSS,
  getFixture('rgb(100,200,150)'),
  getFixture(colorTransformer('rgb(100,200,150)', 'deuteranopia'))
);

test(
  'should do a rgba transform',
  testPostCSS,
  getFixture('rgb(100,200,150,.4)'),
  getFixture(colorTransformer('rgb(100,200,150,.4)', 'deuteranopia'))
);

test(
  'should do a hsl transform',
  testPostCSS,
  getFixture('hsl(120, 30%, 80%)'),
  getFixture(colorTransformer('hsl(120, 30%, 80%)', 'deuteranopia'))
);

test(
  'should do a hsla transform',
  testPostCSS,
  getFixture('hsla(120, 30%, 80%, .8)'),
  getFixture(colorTransformer('hsla(120, 30%, 80%, .8)', 'deuteranopia'))
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
  'should do no transforms on a CSS file with no colors',
  testPassthrough,
  `.some-thing #blue {
    background-image: url(blue.jpg);
    display: inline-block;
  }
  h1.other-thing {
    background-image: url('http://www.example.com/red/blue#333');
    border-color: transparent;
    display: flex;
    color: lolnotacolor;
  }`
);

test(
  'should handle weird capitalization of method names',
  testPostCSS,
  getFixture('#FFCC00'),
  getFixture(colorblind.deuteranopia('#FFCC00')),
  {method: 'DEuTerAnopiA'}
);

test(
  'should handle weird whitespace',
  testPostCSS,
  getFixture('#FFCC00'),
  getFixture(colorblind.deuteranopia('#FFCC00')),
  {method: ' deuteranopia      '}
);

test(
  'should handle capitalized color names',
  testPostCSS,
  getFixture('ALICebLuE'),
  getFixture(colorblind.deuteranopia('aliceblue'))
);

test(
  'should not mangle font names',
  testPassthrough,
  `.some-font { font-family: 'Helvetica Neue', sans-serif; }`
);

test('should throw an error on a bad method name', function(t) {
  t.throws(function () {
    return testPostCSS(t, 'h1{}', 'h1{}', {method:'bad method name'})
  });
});
