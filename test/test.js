// dependencies
var fs = require("fs")
var postcss = require("postcss")
var colorblindPlugin = require(".");

var case1 = fs.readFileSync("input.css", "utf8");

var postCss = postcss().use(colorblindPlugin('tritanopia'));
var processCss = function(css) {
  return postCss
    .process(css)
    .css;
};

var processed = processCss(case1);
fs.writeFileSync('output.css', processed);

