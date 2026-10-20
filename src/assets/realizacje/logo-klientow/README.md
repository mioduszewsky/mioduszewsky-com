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

Nie zrobione w tej rundzie: przekazane innemu zespołowi. Notatka dla wykonawcy: na cannversity.com logo to raster `assets/logo-horizontal-CGUL4rDn.png` (1772x443, z przezroczystością, identyczny z `~/cannversity/src/assets/logo-horizontal.png`), wymaga wektoryzacji.

## glassstone.svg, igor-grabowski.svg

Poza zakresem tej rundy, plików brak.
