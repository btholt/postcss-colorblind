# 1.0.0

- **BREAKING**: postcss-colorblind must now be used as an asynchronous plugin.
- **BREAKING**: Now requires PostCSS 5.
- Add support for rewriting image references where possible to color-shifted
  inline base 64 data.
- Add support for colors inside gradients.
- Fixes an issue where the whole declaration would be lowercased, destroying
  certain case-sensitive tokens. Now, only `<color>` values are lowercased.
- Now correctly calculates opacity for 4 & 8 character hex codes.

# 0.4.0

- Add support for 4 and 8 character hex codes (`#rgba` & `#rrggbbaa` respectively).

# 0.3.0

- Add support for rgb, rgba, hsl, and hsla
- Add jscs config
- Add more unit tests
- Broke out color-transformer
- :beetle: :collision: Fix improbable scenario where you had a valid hex inside of another strick

# 0.2.1

- **BREAKING**: Adopt a config object instead of a config string
- Add CSS color names
- Add unit tests for color names
- Begin tracking change log
- Change plugin to use PostCSS API for creating plugin

# 0.1.0

- Initial release
- Only hex colors
- Initial unit tests
