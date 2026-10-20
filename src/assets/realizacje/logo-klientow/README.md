# Logo klientów do case study

Data: 20.10.2026. Każdy plik jednobarwny, `fill="currentColor"`, ciasny viewBox, bez width/height, bez fontów, rastrów i skryptów.

## eskapizm.svg

- Źródło: https://eskapizm.com, logo w nagłówku (`<a href="/">eskapizm</a>` w nawigacji oraz `button.logo` w hero filmu). Logo to sam napis, bez znaku graficznego i bez pliku SVG w repo `~/eskapizmplany`.
- Metoda: tekst na ścieżki z tego samego pliku fontu, który ładuje żywa strona: Crimson Text SemiBold 600, Google Fonts v19, podzbiór latin (`fonts.gstatic.com/s/crimsontext/v19/wlppgwHKFkZgtmSR3NB0oRJXsCxGDNNQ.woff2`, wersja fontu 1.100). Kształtowanie przez HarfBuzz z kerningiem i ligaturami jak w przeglądarce (`font-kerning: auto`, `font-variant-ligatures: normal`).
- Ustawienia z `getComputedStyle` na żywej stronie: `font-family: "Crimson Text"`, `font-weight: 600`, `font-style: normal`, `font-stretch: 100%`, `letter-spacing: normal`, `text-transform: none`, małe litery. Rozmiar 22 px (nawigacja) i 24 px (hero), proporcje te same.
- viewBox: `0 0 3918 916` (jednostki fontu, 1024 na em), proporcja szer./wys. 4,28. Wysokość obejmuje ogonek „p” i kropkę „i”.
- Oryginalne kolory: nawigacja `rgb(28, 25, 23)` (stone-900, `#1C1917`), najazd sage-600; hero biały `#FFFFFF` na filmie.
- Weryfikacja: nakładka na zrzut z eskapizm.com (4x), kształty liter 1:1, różnica szerokości około 0,5% z zaokrąglania pozycji liter przy 24 px.

## cannversity.svg

- Źródło: logo z nagłówka cannversity.com, raster `assets/logo-horizontal-CGUL4rDn.png` (1772x443, przezroczystość), identyczny z `~/cannversity/src/assets/logo-horizontal.png`. Wektora ani SVG w repo Cannversity nie ma.
- Metoda: trasowanie konturów z tego PNG (jedna ścieżka, `fill="currentColor"`). Napis nie jest z fontu: Archivo 125/800 ma litery o 8-13% szersze, a „I” w logo ma szeryfy (IoU z fontu tylko 0,79).
- viewBox `0 0 1424 320` (4,45:1): roślina x 1-194, kreska x 307-318, napis x 394-1422; wersaliki y 118-199, linia bazowa y=199.
- W lockupie: `fit={{ h: 1, base: 199 / 320 }}` (wysokość SVG = wysokość wideo mioduszewsky, linia bazowa napisu na linii bazowej mioduszewsky).
- Oryginalny kolor: zieleń w nagłówku, czerń w stopce (`logo-black.png`).
- Weryfikacja: nakładka 1:1 na PNG, IoU 0,987 (pełne) i 0,992 (`cannversity-napis.svg`, sam napis, viewBox `0 0 1031 88`, zapas na małe skale). Nakładka: `docs/case-studies/final-2026-10-20/cannversity/logo-kontrola.png` (lokalnie, `docs/` poza gitem).

## glassstone.svg, igor-grabowski.svg

Poza zakresem tej rundy, plików brak.
