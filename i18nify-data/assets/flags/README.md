# Flags

| Folder | Aspect | Use |
|---|---|---|
| `4x3/` | 20×15 viewBox, rounded corners, 10% inner border | Inline flags, lists, the `4X3` URL from `getFlagOfCountry` |
| `1x1/` | square, no frame | Circular avatars and badges, the `1X1` URL from `getFlagOfCountry` |

Filenames are lowercase ISO 3166-1 alpha-2 codes (`in.svg`) or ISO 3166-2 style
subdivision codes (`gb-eng.svg`, `sh-ac.svg`). Both folders contain the same set
of codes. The i18nify-js build copies `4x3/` flat to `lib/assets/flags/` and
`1x1/` to `lib/assets/flags/1x1/`; keep that layout because the package points
at an unversioned unpkg URL.

## Maintenance

Every SVG is optimised with svgo (`yarn optimize-flags`, config in
`../svgo.config.mjs`). Ids are prefixed per file and folder (`in_4x3__a`) so
several flags can be inlined on one page without clashes. Rerunning the script
is a no-op.

## Sources

- The original 4:3 set was drawn for i18nify.
- `4x3/`: `arab asean cefta cp dg eac es-ct es-ga es-pv eu ic pc sh-ac sh-hl
  sh-ta un xk xx` come from [flag-icons](https://github.com/lipis/flag-icons),
  wrapped in the i18nify frame.
- `1x1/`: from flag-icons, except `bq-bo`, `bq-sa`, `bq-se` from
  [country-flag-icons](https://github.com/catamphetamine/country-flag-icons),
  `gb-ukm` which reuses the flag-icons `gb` square, and `yt-unf` which is a
  centre crop of the i18nify 4:3 flag.

Both packages are MIT licensed:

```
flag-icons
The MIT License (MIT)

Copyright (c) 2013 Panayiotis Lipiridis

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

country-flag-icons
(The MIT License)

Copyright (c) 2020 @catamphetamine <purecatamphetamine@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.```
