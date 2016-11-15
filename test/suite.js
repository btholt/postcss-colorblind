var postcss = require("postcss");
var colorblindPlugin = require("..");
var colorTransformer = require('../src/color-transformer');
var colorNames = require('css-color-names');
var colorblind = require('color-blind');
var onecolor = require('onecolor');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Interal Color Transformer', function() {

  it('should transform hex', function() {
    var caseColor = "#123";
    var caseColor2 = "#000";
    var caseColor3 = "#fff";
    var caseColor4 = "#f06d06";
    assert.equal(colorTransformer(caseColor, 'deuteranopia'), colorblind.deuteranopia(caseColor));
    assert.equal(colorTransformer(caseColor2, 'deuteranopia'), colorblind.deuteranopia(caseColor2));
    assert.equal(colorTransformer(caseColor3, 'deuteranopia'), colorblind.deuteranopia(caseColor3));
    assert.equal(colorTransformer(caseColor4, 'deuteranopia'), colorblind.deuteranopia(caseColor4));
  });

  it('should transform hexa', function() {
    var hexaColor = "#1234";
    var hexColor = "#123";
    var opacity = '0.45';
    var hexaColor2 = "#9344ABCD";
    var hexColor2 = "#9344AB";
    var opacity2 = '0.45';
    var hexaColor3 = "#FFFFFFFF";
    var hexColor3 = "#FFFFFF";
    var opacity3 = '0.45';
    var hexaColor4 = "#0000";
    var hexColor4 = "#000";
    var opacity4 = '0.45';

    assert.equal(colorTransformer(hexaColor, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor)).alpha(opacity).cssa());
    assert.equal(colorTransformer(hexaColor2, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor2)).alpha(opacity2).cssa());
    assert.equal(colorTransformer(hexaColor3, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor3)).alpha(opacity3).cssa());
    assert.equal(colorTransformer(hexaColor4, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor4)).alpha(opacity4).cssa());
  });

  it('should transform named colors', function() {
    var caseColor = "mediumSeaGreen";
    var hexColor = "#3CB371";
    var caseColor2 = "PapayaWhip";
    var hexColor2 = "#FFEFD5";
    var caseColor3 = "thistle";
    var hexColor3 = "#D8BFD8";
    var caseColor4 = "BlanchedAlmond";
    var hexColor4 = "#FFEBCD";
    var caseColor5 = "rebeccaPurple";
    var hexColor5 = "#639";
    assert.equal(colorTransformer(caseColor, 'deuteranopia'), colorblind.deuteranopia(hexColor));
    assert.equal(colorTransformer(caseColor2, 'deuteranopia'), colorblind.deuteranopia(hexColor2));
    assert.equal(colorTransformer(caseColor3, 'deuteranopia'), colorblind.deuteranopia(hexColor3));
    assert.equal(colorTransformer(caseColor4, 'deuteranopia'), colorblind.deuteranopia(hexColor4));
    assert.equal(colorTransformer(caseColor5, 'deuteranopia'), colorblind.deuteranopia(hexColor5));
  });

  it('should transform rgb', function() {
    var rgbColor = "rgb(30, 50, 200)";
    var hexColor = "#1E32C8";
    var rgbColor2 = "rgb(100, 200, 0)";
    var hexColor2 = "#64C800";
    var rgbColor3 = "rgb(150,50,50)";
    var hexColor3 = "#963232";
    assert.equal(colorTransformer(rgbColor, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor)).css());
    assert.equal(colorTransformer(rgbColor2, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor2)).css());
    assert.equal(colorTransformer(rgbColor3, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor3)).css());
  });

  it('should transform rgba', function() {
    var rgbaColor = "rgba(30, 50, 200, 1)";
    var hexColor = "#1E32C8";
    var alpha = 1
    var rgbaColor2 = "rgba(100, 200, 0, 0)";
    var hexColor2 = "#64C800";
    var alpha2 = 0;
    var rgbaColor3 = "rgba(150,50,50,.4)";
    var hexColor3 = "#963232";
    var alpha3 = .4;

    assert.equal(colorTransformer(rgbaColor, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor)).alpha(alpha).cssa());
    assert.equal(colorTransformer(rgbaColor2, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor2)).alpha(alpha2).cssa());
    assert.equal(colorTransformer(rgbaColor3, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor3)).alpha(alpha3).cssa());
  });

  it('should transform hsl', function() {
    var hslColor = "hsl(30, 50%, 50%)";
    var hexColor = "#BF8040";
    var hslColor2 = "hsl(100, 80%, 30%)";
    var hexColor2 = "#388A0F";
    var hslColor3 = "hsl(150,50%,50%)";
    var hexColor3 = "#40BF80";
    assert.equal(colorTransformer(hslColor, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor)).css());
    assert.equal(colorTransformer(hslColor2, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor2)).css());
    assert.equal(colorTransformer(hslColor3, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor3)).css());
  });

  it('should transform hsla', function() {
    var hslaColor = "hsla(30, 50%, 50%, 1)";
    var hexColor = "#BF8040";
    var alpha = 1
    var hslaColor2 = "hsla(100, 80%, 30%, 0)";
    var hexColor2 = "#388A0F";
    var alpha2 = 0;
    var hslaColor3 = "hsla(150,50%,50%,.4)";
    var hexColor3 = "#40BF80";
    var alpha3 = .4;

    assert.equal(colorTransformer(hslaColor, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor)).alpha(alpha).cssa());
    assert.equal(colorTransformer(hslaColor2, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor2)).alpha(alpha2).cssa());
    assert.equal(colorTransformer(hslaColor3, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor3)).alpha(alpha3).cssa());
  });

  it('should not transform not-color tokens', function() {
    assert.equal(colorTransformer('3px'), '3px');
    assert.equal(colorTransformer('not a color'), 'not a color');
    assert.equal(colorTransformer('http://www.bluehost.com/index.html#f06d06'), 'http://www.bluehost.com/index.html#f06d06');
  });

});

describe('PostCSS Plugin', function() {
  var postCss;

  beforeEach(function() {
    postCss = postcss();
  });

  it('should do a simple hex deuteranopia transform', function() {
    postCss.use(colorblindPlugin({method:'deuteranopia'}));
    var caseColor = "#FFCC00";
    var input = `
    .some-color {
      color: ${caseColor};
    }
    `;

    var answer = `
    .some-color {
      color: ${colorblind.deuteranopia(caseColor)};
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should do a simple hex achromatopsia transform', function() {
    postCss.use(colorblindPlugin({method:'achromatopsia'}));
    var caseColor = "#D929E2";
    var input = `
    .some-color {
      border: 3px ${caseColor} solid;
      font-size: 12px;
    }
    `;

    var answer = `
    .some-color {
      border: 3px ${colorblind.achromatopsia(caseColor)} solid;
      font-size: 12px;
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should do a simple named color deuteranopia transform', function() {
    postCss.use(colorblindPlugin({method:'deuteranopia'}));
    var caseColor = "red";
    var ansColor = colorblind.deuteranopia(colorNames[caseColor]);
    var input = `
    .some-color {
      border: 3px ${caseColor} solid;
      font-size: 12px;
    }
    `;

    var answer = `
    .some-color {
      border: 3px ${ansColor} solid;
      font-size: 12px;
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should do a multi tritanopia transform', function() {
    postCss.use(colorblindPlugin({method:'tritanopia'}));
    var caseColor = "#D929E2";
    var caseColor2 = "#B28200";
    var caseColor3 = "lime";
    var ansColor3 = colorblind.tritanopia(colorNames[caseColor3]);
    var input = `
    .some-color {
      border: 3px ${caseColor} dashed;
      color: ${caseColor2};
      font-size: 12px;
    }
    #other-thing {
      border-color: ${caseColor3}
    }
    `;

    var answer = `
    .some-color {
      border: 3px ${colorblind.tritanopia(caseColor)} dashed;
      color: ${colorblind.tritanopia(caseColor2)};
      font-size: 12px;
    }
    #other-thing {
      border-color: ${ansColor3}
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should do a rgb transform', function() {
    postCss.use(colorblindPlugin({method:'deuteranopia'}));
    var caseColor = 'rgb(100,200,150)';
    var transformedColor = colorTransformer(caseColor, 'deuteranopia');
    var input = `
    .some-color {
      color: ${caseColor};
    }
    `;
    var answer = `
    .some-color {
      color: ${transformedColor};
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should do a rgba transform', function() {
    postCss.use(colorblindPlugin({method:'deuteranopia'}));
    var caseColor = 'rgba(100,200,150,.4)';
    var transformedColor = colorTransformer(caseColor, 'deuteranopia');
    var input = `
    .some-color {
      color: ${caseColor};
    }
    `;
    var answer = `
    .some-color {
      color: ${transformedColor};
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should do a hsl transform', function() {
    postCss.use(colorblindPlugin({method:'deuteranopia'}));
    var caseColor = "hsl(120, 30%, 80%)";
    var transformedColor = colorTransformer(caseColor, 'deuteranopia');
    var input = `
    .some-color {
      color: ${onecolor(caseColor).css()};
    }
    `;
    var answer = `
    .some-color {
      color: ${transformedColor};
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should do a hsla transform', function() {
    postCss.use(colorblindPlugin({method:'deuteranopia'}));
    var caseColor = "hsla(120, 30%, 80%, .8)";
    var transformedColor = colorTransformer(caseColor, 'deuteranopia');
    var input = `
    .some-color {
      color: ${onecolor(caseColor).cssa()};
    }
    `;
    var answer = `
    .some-color {
      color: ${transformedColor};
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should work inside gradients', function() {
    postCss.use(colorblindPlugin({method:'deuteranopia'}));
    var caseColor = "hsla(120, 30%, 80%, .8)";
    var transformedColor = colorTransformer(caseColor, 'deuteranopia');
    var input = `
    .some-color {
      background: linear-gradient(#000000, ${onecolor(caseColor).cssa()});
    }
    `;
    var answer = `
    .some-color {
      background: linear-gradient(#000000, ${transformedColor});
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should do no transforms on a CSS file with no colors', function() {
    postCss.use(colorblindPlugin({method:'deuteranopia'}));
    var input = `
    .some-thing #blue {
      background-image: url(blue.jpg);
      display: inline-block;
    }
    h1.other-thing {
      background-image: url('http://www.example.com/red/blue#333');
      border-color: transparent;
      display: flex;
      color: lolnotacolor;
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, input);
  });

});

describe('PostCSS Plugin Edge Cases', function() {
  var postCss;

  beforeEach(function() {
    postCss = postcss();
  });

  it('should assume deuteranopia given no parameter', function() {
    postCss.use(colorblindPlugin());
    var caseColor = "#FFCC00";
    var input = `
    .some-color {
      color: ${caseColor};
    }
    `;

    var answer = `
    .some-color {
      color: ${colorblind.deuteranopia(caseColor)};
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should handle weird capitalization of method names', function() {
    postCss.use(colorblindPlugin({method:'DEuTerAnopiA'}));
    var caseColor = "#FFCC00";
    var input = `
    .some-color {
      color: ${caseColor};
    }
    `;

    var answer = `
    .some-color {
      color: ${colorblind.deuteranopia(caseColor)};
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should handle weird whitespace', function() {
    postCss.use(colorblindPlugin({method:' deuteranopia      '}));
    var caseColor = "#FFCC00";
    var input = `
    .some-color {
      color: ${caseColor};
    }
    `;

    var answer = `
    .some-color {
      color: ${colorblind.deuteranopia(caseColor)};
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should handle capitalized color names', function() {
    postCss.use(colorblindPlugin({method:'deuteranopia'}));
    var caseColor = "ALICebLuE";
    var ansColor = colorblind.deuteranopia(colorNames[caseColor.toLowerCase()]);
    var input = `
    .some-color {
      color: ${caseColor};
    }
    `;

    var answer = `
    .some-color {
      color: ${ansColor};
    }
    `;
    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, answer);
  });

  it('should not mangle font names', function() {
    postCss.use(colorblindPlugin());
    var input = `
    .some-font {
      font-family: 'Helvetica Neue', sans-serif;
    }
    `;

    var processed = postCss
      .process(input)
      .css;
    assert.equal(processed, input);
  });

  it('should throw an error on a bad method name', function() {
    expect(function() {
      postCss.use(colorblindPlugin({method:'bad method name'}));
    })
    .to.throw();
  });

});
