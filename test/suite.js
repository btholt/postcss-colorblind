// dependencies
var fs = require("fs")
var postcss = require("postcss")
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
    assert.equal(colorTransformer.transform(caseColor, 'deuteranopia'), colorblind.deuteranopia(caseColor));
    assert.equal(colorTransformer.transform(caseColor2, 'deuteranopia'), colorblind.deuteranopia(caseColor2));
    assert.equal(colorTransformer.transform(caseColor3, 'deuteranopia'), colorblind.deuteranopia(caseColor3));
    assert.equal(colorTransformer.transform(caseColor4, 'deuteranopia'), colorblind.deuteranopia(caseColor4));
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
    assert.equal(colorTransformer.transform(caseColor, 'deuteranopia'), colorblind.deuteranopia(hexColor));
    assert.equal(colorTransformer.transform(caseColor2, 'deuteranopia'), colorblind.deuteranopia(hexColor2));
    assert.equal(colorTransformer.transform(caseColor3, 'deuteranopia'), colorblind.deuteranopia(hexColor3));
    assert.equal(colorTransformer.transform(caseColor4, 'deuteranopia'), colorblind.deuteranopia(hexColor4));
  });

  it('should transform rgb', function() {
    var rgbColor = "rgb(30, 50, 200)";
    var hexColor = "#1E32C8";
    var rgbColor2 = "rgb(100, 200, 0)";
    var hexColor2 = "#64C800";
    var rgbColor3 = "rgb(150,50,50)";
    var hexColor3 = "#963232";
    assert.equal(colorTransformer.transform(rgbColor, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor)).css());
    assert.equal(colorTransformer.transform(rgbColor2, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor2)).css());
    assert.equal(colorTransformer.transform(rgbColor3, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor3)).css());
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
    
    assert.equal(colorTransformer.transform(rgbaColor, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor)).alpha(alpha).cssa());
    assert.equal(colorTransformer.transform(rgbaColor2, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor2)).alpha(alpha2).cssa());
    assert.equal(colorTransformer.transform(rgbaColor3, 'deuteranopia'), onecolor(colorblind.deuteranopia(hexColor3)).alpha(alpha3).cssa());
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

  xit('should do a rgb transform', function() {
    console.log(colorTransformer._applyColorTransform('rgba(100,200,150,.4)', 'rgba', 'deuteranopia'));
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

  it('should throw an error on a bad method name', function() {
    expect(function() {
      postCss.use(colorblindPlugin({method:'bad method name'}));
    })
    .to.throw();
  });


});
