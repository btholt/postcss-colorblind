// dependencies
var fs = require("fs")
var postcss = require("postcss")
var colorblindPlugin = require("..");

var assert = require('chai').assert;


// css to be processed
var case1 = fs.readFileSync("test/case1.css", "utf8");
// var answer1 = fs.readFileSync("test/answer1.css", "utf8");
// var case2 = fs.readFileSync("test/case2.css", "utf8");
// var answer2 = fs.readFileSync("test/answer2.css", "utf8");
// var case3 = fs.readFileSync("test/case3.css", "utf8");
// var answer3 = fs.readFileSync("test/answer3.css", "utf8");

// process css

var postCss = postcss().use(colorblindPlugin());
var processCss = function(css) {
  return postCss
    .process(css)
    .css;
};

describe('Basic Functionality', function() {

  it('should replace a red to green', function() {
    var processed = processCss(case1);
    console.log(processed);
    // assert.equal(processed, answer1);
  });

  // it('should replace a border\'s to green', function() {
  //   var processed = processCss(case2);
  //   assert.equal(processed, answer2);
  // });

});

describe('Edge Cases', function() {
  // it("shouldn't replace a color in a URL", function() {
  //   var processed = processCss(case3);
  //   assert.equal(processed, answer3);
  // });
})

