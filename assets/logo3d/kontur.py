# Logo 3D z wpalonym konturem dla lockupu case'ów (CaseLockup.astro), 20.10.2026.
# Ciemnobrązowa obwódka (rgb 60 36 0, krycie 0,95, promień R px przy 2048) pod żółtymi literami: czytelność na żółci
# Cannversity (#ffcc33), kremie, bieli i filmie. Kontur z CSS (filter: drop-shadow) WebKit pomija na <video>, stąd w pliku.
# Uruchom z katalogu roboczego poza repo (klatki to setki MB):
#   ffmpeg -c:v libvpx-vp9 -i <repo>/public/logo3d/logo.webm -vf format=rgba src/f_%04d.png
#   R=7 python3 <repo>/assets/logo3d/kontur.py            # potrzebne: pillow, numpy, scipy
#   ffmpeg -framerate 30 -i out/f_%04d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 42 -row-mt 1 logo-nav-kontur.webm
#   ffmpeg -framerate 30 -i out/f_%04d.png -c:v hevc_videotoolbox -allow_sw 1 -alpha_quality 0.6 -q:v 50 -tag:v hvc1 -pix_fmt bgra logo-nav-kontur.mp4
# Wynik: out/ (800x222, klatki do wideo) i logo-nav-3d-400/800.webp (klatka 0 = obraz spoczynkowy pod wideo).
import glob, os
import numpy as np
from PIL import Image
from scipy import ndimage

R = float(os.environ.get('R', 7))
COL, A = np.array([60, 36, 0], float), .95
os.makedirs('out', exist_ok=True)
for f in sorted(glob.glob('src/f_*.png')):
    im = np.asarray(Image.open(f).convert('RGBA')).astype(float) / 255
    a = im[..., 3]
    ka = np.clip(R + .5 - ndimage.distance_transform_edt(a < .5), 0, 1) * A
    oa = a + ka * (1 - a)
    rgb = (im[..., :3] * a[..., None] + COL / 255 * ka[..., None] * (1 - a[..., None])) / np.maximum(oa, 1e-6)[..., None]
    img = Image.fromarray((np.dstack([rgb, oa]) * 255 + .5).astype(np.uint8), 'RGBA')
    img.resize((800, 222), Image.LANCZOS).save('out/' + os.path.basename(f))
    if f.endswith('0001.png'):
        for w in (400, 800):
            img.resize((w, round(w * 222 / 800)), Image.LANCZOS).save(f'logo-nav-3d-{w}.webp', 'WEBP', quality=90, method=6, exact=True)
