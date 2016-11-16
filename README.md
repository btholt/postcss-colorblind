# PostCSS Colorblind Plugin

## Why?

The biggest reason is that as many developers don't have problems seeing color, they never stop to consider that their (or their constituents') choices of colors make their website unusuable and frustrating to those who can't see some shades of color. It's not even small problem either; lots of people struggle with red and green.

However, there are JavaScript bookmarklets that let you do this on the fly without having to run a build step. I built this with the thought in mind you could create an automated step to create a report of how you're doing with color.

And lastly, building plugins for PostCSS is so damn easy and fun.

Plugin currently works for any place a CSS color is declared in hex, named color (like `red` or `papayawhip`), rgb, rgba, hsl, and hsla. Support for images forthcoming.

## Install

`npm install postcss-colorblind`

## Setup

To make this module as effective as possible, make this the last module that modifies your CSS.

```javascript
var fs = require("fs")
var postcss = require("postcss")
var colorblindPlugin = require("postcss-colorblind");

var css = fs.readFileSync("input.css", "utf8");

var processed = postcss()
  .use(colorblindPlugin({method:'achromatopsia'}))
  .process(css)
  .css;
fs.writeFileSync('output.css', processed);
```

## Parameters

### method _(default: deuteranopia)_

The module expects an object with a method name that it can give to the [color-blind](https://github.com/skratchdot/color-blind) module. Thus, as of writing, any of the following will work:

- protanomaly
- protanopia
- deuteranomaly
- deuteranopia
- tritanomaly
- tritanopia
- achromatomaly
- achromatopsia

## Color Blindness Table

Borrowed from @skratchdot's [color-blind](https://github.com/skratchdot/color-blind), the dependency of this module.

|                    Group                           |                                    |                             |                          |
|----------------------------------------------------|------------------------------------|-----------------------------|--------------------------|
| **Trichromat**<br/>*3 good cones*                  |Normal                              |                             |                          |
| **Anomalous Trichromat**<br/>*2 good cones, 1 bad* |Protanomaly<br/>*low red*           |Deuteranomaly<br/>*low green*|Tritanomaly<br/>*low blue*|
| **Dichromat**<br/>*2 good cones, 1 blind*          |Protanopia<br/>*no red*             |Deuteranopia<br/>*no green*  |Tritanopia <br/>*no blue* |
| **Monochromat**<br/>*1 good cone, 2 blind/bad*     |Achromatomaly<br />*almost no color*|Achromatopsia<br/>*no color* |                          |

## Examples

All colors, no filter:

![All colors](img/all.jpg)

Deuteranopia, no green:

![Deuteranopia](img/deuteranopia.jpg)

Achromatopsia, no color:

![Achromatopsia](img/achromatopsia.jpg)

## License

MIT

## Author

:heart: [Brian Holt](http://twitter.com/holtbt)
