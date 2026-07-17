# Balonowe logo 3D „mioduszewsky" — jak edytować i renderować

Efekt logotypu w stylu flayks.com: napis jako napompowane, błyszczące rurki 3D,
przezroczyste wideo w pętli (VP9 alpha webm + HEVC alpha mp4), osadzane zwykłym `<video>`.
Zbudowane 14.07.2026. Kolor zaakceptowany: **#FFCC33**.

## Gdzie co leży

```
~/mioduszewsky-com/assets/logo3d/
  logo.webm        ← FINAŁ dla Chrome/Firefox (VP9 z alfą, ~1.3 MB)
  logo.mp4         ← FINAŁ dla Safari (HEVC hvc1 z alfą, ~2.0 MB)
  tube_logo.py     ← GENERATOR sceny (jedyne źródło prawdy — tu się edytuje)
  tube.blend       ← zbudowana scena (artefakt, można zawsze odtworzyć skryptem)
  preview.html     ← podgląd w przeglądarce (header/czerń/krem/żółty)
  INSTRUKCJA.md    ← ten plik
```

Wymagane narzędzia (zainstalowane przez Homebrew 14.07.2026): `blender` (cask), `ffmpeg`.

## Osadzenie na stronie (wzór 1:1 z flayks)

```html
<video autoplay loop muted playsinline preload="auto" width="..." height="...">
  <source src="/assets/logo3d/logo.mp4" type="video/mp4;codecs=hvc1">
  <source src="/assets/logo3d/logo.webm" type="video/webm">
  <p>mioduszewsky</p>
</video>
```

Kolejność źródeł ma znaczenie: mp4 (hvc1) pierwszy — Safari nie umie VP9 alpha.
Alfa działa na dowolnym tle strony.

## WORKFLOW EDYCJI (zawsze w tej kolejności!)

Godzinny render finalny odpala się DOPIERO po akceptacji stillki. Kolejność:

1. **Edytuj** `tube_logo.py`
2. **Zbuduj scenę + stillka** (~40 s łącznie):
   ```bash
   cd ~/mioduszewsky-com/assets/logo3d
   blender -b -P tube_logo.py -- FFCC33 "$PWD/tube.blend"
   blender -b tube.blend -o "$PWD/still_####" -F PNG -f 1
   open still_0001.png     # oceń
   ```
3. **(opcjonalnie) Draft ruchu EEVEE** (~2-3 min, pełna animacja w niższej jakości):
   ```bash
   blender -b tube.blend --python-expr "
   import bpy; s=bpy.context.scene
   s.render.engine='BLENDER_EEVEE_NEXT'; s.render.resolution_percentage=50
   s.eevee.taa_render_samples=16" -o "$PWD/draft/d_####" -F PNG -s 1 -e 180 -a
   ffmpeg -y -framerate 30 -i draft/d_%04d.png -c:v libvpx-vp9 -pix_fmt yuva420p -crf 36 draft.webm
   ```
4. **Render finalny Cycles** (~35-40 min na GPU) + enkodowanie:
   ```bash
   blender -b tube.blend -o "$PWD/frames/f_####" -F PNG -s 1 -e 180 -a
   ffmpeg -y -framerate 30 -i frames/f_%04d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 34 -row-mt 1 logo.webm
   ffmpeg -y -framerate 30 -i frames/f_%04d.png -c:v hevc_videotoolbox -allow_sw 1 -alpha_quality 0.7 -q:v 58 -tag:v hvc1 -pix_fmt bgra logo.mp4
   rm -rf frames draft still_*.png   # posprzątaj klatki (setki MB)
   ```
5. **Weryfikacja alfy** (musi zwrócić `1`):
   ```bash
   ffprobe -v error -show_entries stream_tags=alpha_mode -of csv=p=0 logo.webm
   ```

## CO SIĘ EDYTUJE W `tube_logo.py`

### Kolor
Hex podaje się ARGUMENTEM (nie w kodzie): `blender -b -P tube_logo.py -- FF5733 ...`
UWAGA: jeśli kolor na renderze „nie łapie" zmiany — winne za mocne światła
(przepalają bazę do bieli). Moce lamp: sekcja `# ── Światła` — key 700, fill 160,
rimy 240 (dobrane pomiarem pikseli pod #FFCC33). Ciemniejszy/głębszy kolor =
najpierw zmniejsz `energy`, dopiero potem kombinuj z hexem.

### Materiał (tekstura/wykończenie)
Sekcja `# ── Materiał`: `Roughness` 0.16 (wyżej = bardziej matowy/gumowy,
niżej = szkliste), `Coat Weight` 0.8 + `Coat Roughness` 0.08 (lakier).
Metaliczny balon: `Metallic` 1.0 + Roughness ~0.25.

### Kształty liter
Słownik `LETTERS` na górze pliku. Każda litera = szkielet monoline:
- `strokes`: listy punktów (x, y) — Blender prowadzi przez nie gładką krzywą
  beziera i nakłada rurę o promieniu `R` (0.30). Układ współrzędnych:
  x-height = 1.0, baseline y=0, wydłużenia górne ~1.68, dolne do ~-0.68.
- `circle`: (cx, cy, promień) dla brzuszków o/d.
- `dots`: kulki (kropka „i").
- `adv`: szerokość litery (advance), `TRACK` 1.02 = globalny ścisk (litery
  lekko się stykają).
- `rscale`: mnożnik grubości rury per litera. **Gęste litery (s: 0.78, e: 0.72,
  w: 0.75) MUSZĄ mieć cieńszą rurę**, inaczej naturalne prześwity się zalewają.

Twarde lekcje (nie powtarzać błędów):
- „e" = DWA stroki (pozioma poprzeczka + hak „c"), jednym ciągiem wychodzi ślimak.
- Dziurka w literze istnieje tylko, gdy odstęp osi rur > 2×promień + ~0.15 zapasu
  (voxel remesh skleja styczne powierzchnie).
- Kropka „i" min. ~0.25 nad szczytem laski, inaczej remesh zrobi szyjkę.
- Rozmiary liter ujednolicone (JIGGLE skala = 1.0) — decyzja Kacpra 14.07.

### Animacja
Sekcja `# ── Animacja`: kołysanie pivotu (±7.5° Y, ±3° X), galaretka per litera
(±2-2.5°, fazy przesunięte), oddychanie skali ±1.5% (`0.015`). Pętla 180 klatek
@ 30 fps = 6 s; wszystkie sinusy mają PEŁNE okresy → idealny loop (klatka 181 = 1).
Szybsze/wolniejsze tempo: zmień `LOOP` (mniej klatek = szybciej przy 30 fps).

### Jakość renderu
`scene.cycles.samples = 128`, rozdzielczość bazowa 2048 px (liczona z proporcji
tekstu). Wersja mniejsza do headera: renderować bez zmian i przeskalować przy
enkodowaniu (`-vf scale=1200:-2`) albo zmniejszyć `resolution_x`.

## Technika (kontekst)

Litery NIE są fontem (font = efekt WordArt, odrzucone). To tube-lettering:
szkielety krzywych → `bevel_depth` daje okrągły profil rury → kulki na końcach
strokes → voxel remesh (0.03) zlewa w balonową powierzchnię → corrective smooth
0.4/8 + smooth 0.5/4 usuwają blizny styków. View transform **'Standard'**
(domyślny AgX wypłukuje kolory). Render z `film_transparent` = PNG z alfą.

Pełna notatka wiedzy: memory `reference-flayks-logo-technika` (Claude) +
wpis w `projekty/mioduszewsky (AUTOFIRMA)/mioduszewsky-com/STATUS.md`.

## Wariant „dalmatyńczyk" (futro) — 15.07.2026

Druga wersja logotypu: białe futro z czarnymi łatami (hair particles Cycles).

```
tube_logo_fur.py        ← generator wariantu (te same LETTERS, osobne FUR_*/SPOT_*)
fur.blend               ← zbudowana scena futrzana
logo-dalmatian.webm/mp4 ← finały (obok logo.webm/mp4 balona — NIE nadpisują)
render_dalmatian.sh     ← finał: render 180 kl. + enkodowanie + sprzątanie klatek
```

Stillka: `blender -b -P tube_logo_fur.py -- "$PWD/fur.blend"` →
`blender -b fur.blend -o "$PWD/still_fur_####" -F PNG -f 1` (~4-5 min, futro liczy
się dużo wolniej niż balon; finał 180 klatek ≈ 12 h).

Twarde lekcje wariantu futrzanego:
- **NIE ustawiaj `tangent_factor`/`normal_factor`** w hair particles — w Blenderze
  5.x skalują DŁUGOŚĆ włosa, nie tylko kierunek (włosy eksplodują na całą scenę).
- Przyjemny plusz = fala (`kink='WAVE'`, mała amplituda), NIE `CURL` (wychodzi
  karakuł/popcorn) i NIE krótki prosty włos (wychodzi proszek/pleśń).
- Biel = jasny kolor + domieszka Diffuse do Hair BSDF + więcej bounces
  (max 24 / transmission 16) + mocne ŚWIATŁO KIERUNKOWE. **Ambient (`world`) NIE
  liczy się jako „mocne lampy" — patrz sekcja niżej, to była kosztowna pomyłka.**

### Dlaczego futro czytało się jak filc — korekta 17.07.2026

Pierwsza wersja (LIVE 16-17.07) miała fakturę zlaną w filc. Diagnoza: **nie
rozdzielczość i nie kompresja — oświetlenie.**

**Reguła, o którą tu chodzi:** oko czyta futro wyłącznie przez **cień rzucany
między włosami**. Zatem:

- **Ambient (`world` Background Strength) niszczy fakturę.** Świeci ze wszystkich
  stron naraz, więc zasypuje każdy cień między włosami. Było `0.55` → jest `0.12`.
  To był główny sprawca. Jeśli futro szarzeje, **NIGDY nie podnoś tego z powrotem.**
- **Światło kierunkowe (`key`, `rim`) jest sojusznikiem, nie wrogiem.** Rozjaśnia
  futro i JEDNOCZEŚNIE rzeźbi cień. Dziś key = `1150`, czyli WYŻEJ niż pierwotne
  `820` — i mimo to faktura jest, bo ambient jest ścięty.
- **Chcesz bielej bez utraty faktury? Podnoś ALBEDO, nie ambient.** Albedo
  (`WHITE`, jasność skóry, `root To Min`) podnosi ogólny poziom, zostawiając cień
  relatywnie ciemnym → kontrast lokalny zostaje. Ambient go kasuje.
- **Mnożniki koloru to pułapka.** `root To Min` (nasada) i jasność skóry mnożą
  kolor CAŁEGO pasma, a przy gęstym futrze widać głównie środek włosa, nie
  końcówkę. Historia iteracji: `root` 0.45 → futro szare (odrzucone), 0.62 → wciąż
  szare (odrzucone), **0.82 = OK**. Skóra: `0.55 × WHITE` (dobrane pod stary
  ambient) szarzyła futro od spodu przez prześwity → `0.88 × WHITE`.
- **Denoise rozmazuje włos.** `use_denoising = False` + `samples 128 → 256`.
  To OIDN robił miękką poświatę wokół liter. Koszt: klatka 5 min zamiast ~4,
  finał ~15 h zamiast ~12.
- **Kompresja dobija resztę.** Futro to szum wysokiej częstotliwości i ginie w VP9
  pierwszy: `crf 34 → 28`, HEVC `q:v 58 → 45`, `alpha_quality 0.7 → 0.9`.
  Waga stopki rośnie ~3,6 → ~8 MB; nieistotne, bo stopka jest pod foldem
  (`preload="metadata"` + poster WebP).
- **NIE kasuj `frames_dal/` automatycznie.** Poprzednio skrypt robił `rm -rf` na
  końcu, przez co korekta samej kompresji wymagała pełnego re-renderu. Klatki
  kasuj RĘCZNIE po akceptacji.
- Ocena stillki **musi iść na czarnym tle** (stopka `.finale` ma `background:
  #000000`) — na białym miękki obrys wygląda znacznie lepiej, niż jest naprawdę:
  ```bash
  ffmpeg -y -f lavfi -i color=c=black:s=2400x700 -i still_fur_0001.png \
    -filter_complex "[0][1]overlay=(W-w)/2:(H-h)/2" -frames:v 1 black.png
  ```
- Czarne łaty leżące na krawędzi liter zlewają się z czarnym tłem stopki i lekko
  wygryzają sylwetkę. **Świadomie zaakceptowane przez Kacpra 17.07** — nie
  „naprawiać" tego bez polecenia.
- Czytelność liter: rura odchudzona globalnie (R 0.165 + futro 0.13 ≈ waga balona
  0.30). Kacper wymaga JEDNOLITEJ grubości liter — bez per-literowych ścienień
  poza `s` (rscale 0.92, poniżej progu percepcji, inaczej pasma S się zlewają).
- Litery otwarte pod futro: `w` szerszy zygzak (adv 2.08), `k` adv 1.22
  (prześwit przed y), `s` minimalnie rozciągnięte (1.14 / -0.12).
- Łaty: voronoi + noise w coords lokalnych obiektu, per-litera offset z Object
  Info Random — reroll układu = zmiana mnożników 21.4/11.9/15.3 w `build_spot_mask`.
