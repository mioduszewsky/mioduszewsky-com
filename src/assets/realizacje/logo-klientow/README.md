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

## glassstone.svg

- Źródło: logo z nagłówka glassstone.pl, raster `assets/logo-glasstone-ixDcEAr0.png` (1920x960, przezroczystość), bajt w bajt ten sam plik co `~/glassstone/src/assets/logo-glasstone.png`. Wektora ani SVG w repo GlassStone nie ma (szukane w `~/glassstone`, `~/glassstone-cad`, workspace).
- Metoda: trasowanie konturów z tego PNG (potrace, port `potracer`, na podwojonej rozdzielczości, próg tuszu względem bieli), jedna ścieżka `fill="currentColor"` z `fill-rule="evenodd"`. Logo ma dwa kolory (sygnet G szaroniebieski, S i napis grafitowy); tu jest jednobarwne, tak jak glassstone.pl samo pokazuje je w hero (`brightness-0 invert`, całe białe).
- viewBox `0 0 1392 385` (3,62:1, piksele oryginału): sygnet GS x 0-783, napis „glass / stone” x 845-1392; dolna krawędź G i S y=381, okrągłe litery napisu schodzą do y=385.
- W lockupie: `fit={{ h: .487, base: 381 / 385 }}` (wysokość sygnetu = wysokość wydłużeń mioduszewsky, jak domyślnie dla wersalików; dół G i S na linii bazowej mioduszewsky).
- Oryginalne kolory: G `rgb(148, 178, 189)`, S i napis `rgb(85, 85, 85)`, w hero glassstone.pl całe białe na zdjęciu.
- Weryfikacja: nakładka 1:1 na PNG, IoU 0,992.

## igor-grabowski.svg

- Źródło: logo z nagłówka igorgrabowski.com, napis `aigor.grabowski` (strona główna i górny pasek podstron, kod `~/aigor-reveal`, `Home.tsx` i `Layout.tsx`). Znaku graficznego ani SVG nie ma.
- Metoda: tekst na ścieżki z tego samego pliku fontu, który ładuje żywa strona: Barlow Black 900, `@fontsource/barlow` podzbiór latin (`igorgrabowski.com/assets/barlow-latin-900-normal-JU8sfp_B.woff2`, identyczny z plikiem w `node_modules`). Kształtowanie przez HarfBuzz z kerningiem i ligaturami jak w przeglądarce, odstęp liter -0,03 em.
- Ustawienia z `getComputedStyle` na żywej stronie: `font-family: Barlow`, `font-weight: 900`, `font-size: 18px`, `letter-spacing: -0.54px` (-0,03 em), `font-stretch: 100%`, `font-kerning: auto`, `font-variant-ligatures: normal`, `text-transform: none`, małe litery.
- viewBox `0 0 6787 939` (jednostki fontu, 1000 na em), proporcja 7,23:1; linia bazowa y=743, x-height 520, wysokość obejmuje „b”, „k”, „l” i ogonek „g”.
- W lockupie: `fit={{ h: 939 * .325 / 520, base: 743 / 939 }}` (x-height Igora = x-height mioduszewsky, 0,325 wysokości wideo, jak eskapizm; linia bazowa na linii bazowej).
- Oryginalne kolory: napis niebieski `rgb(21, 51, 245)` (`#1533F5`), kropka cyjan `rgb(56, 200, 245)` (`#38C8F5`); na ciemnym pasku podstron napis biały.
- Weryfikacja: nakładka na zrzut z igorgrabowski.com (4x), IoU 0,958 (krawędzie wygładzania), różnica proporcji 0,5% z zaokrąglania pozycji liter przy 18 px.
