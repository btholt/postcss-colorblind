var test = require('ava');
var getFixture = require('./_getFixture');
var testPostCSS = require('./_testPostCSS');

/*
 * Tests in this file should pass through their input
 * and not transform it in any way.
 */

function testPassthrough (t, input, options) {
  return testPostCSS(t, input, input, options);
}

test(
  'should not convert length values',
  testPassthrough,
  getFixture('3px')
);

test(
  'should not convert invalid colors',
  testPassthrough,
  getFixture('not a color')
);

test(
  'should not convert non-image urls',
  testPassthrough,
  getFixture('url(http://www.bluehost.com/index.html#f06d06)')
);

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
  'should not mangle font names',
  testPassthrough,
  `.some-font { font-family: 'Helvetica Neue', sans-serif; }`
);
