# Logo „mioduszewsky” 3D, pliki marki

Balonowe logo z Blendera (`../tube_logo.py`), dwa kolory tej samej bryły i tego samego światła. Tło przezroczyste (alfa).

| Plik | Kolor | Rozmiar |
|---|---|---|
| `mioduszewsky-3d-zolte-{2048,1024,512}.png/.webp` | żółte #FFCC33 | 2048x566, 1024x283, 512x142 |
| `mioduszewsky-3d-czarne-{2048,1024,512}.png/.webp` | czarne #111111 | jak wyżej |

Zasada: żółte na ciemnym tle i na filmie, czarne na jasnym (krem, biel, żółć). Nigdy płaskie, nigdy z obrysem.

Źródła: żółte `../tube_zolte.blend` (generator z `FFCC33`) i wideo `../logo.webm/.mp4`; czarne `../tube_czarne.blend`.
Wideo pętli do nawigacji: `public/logo3d/logo-nav.*` (żółte) i `public/logo3d/logo-czarne-3d-nav.*` (czarne).
Klatka statyczna = klatka 1 pętli. Przepisy renderu: `../INSTRUKCJA.md`, sekcja „Wariant czarny”.
