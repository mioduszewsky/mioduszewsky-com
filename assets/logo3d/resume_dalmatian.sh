#!/bin/bash
# Wznawia render dalmatyńczyka od miejsca, w którym stanął.
# Kiedy użyć: render padł (np. GPU nie wstało po wybudzeniu Maca) albo został ubity.
# Klatki już policzone leżą w frames_dal/ i NIE są liczone drugi raz
# (use_overwrite=False → Blender pomija istniejące pliki).
set -e
cd ~/mioduszewsky-com/assets/logo3d

if pgrep -f "render_dalmatian.sh" > /dev/null 2>&1; then
  echo "STOP: render już leci. Nie odpalaj drugiego naraz — zabiją się o GPU."
  exit 1
fi

have=$(ls frames_dal/ 2>/dev/null | wc -l | tr -d ' ')
echo "START WZNOWIENIA: $(date) — na dysku $have/180 klatek"

blender -b fur.blend --python-expr "
import bpy
bpy.context.scene.render.use_overwrite = False
bpy.context.scene.render.use_placeholder = True
" -o "$PWD/frames_dal/f_####" -F PNG -s 1 -e 180 -a

echo "RENDER DONE: $(date)"
ffmpeg -y -framerate 30 -i frames_dal/f_%04d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 28 -row-mt 1 logo-dalmatian.webm
ffmpeg -y -framerate 30 -i frames_dal/f_%04d.png -c:v hevc_videotoolbox -allow_sw 1 -alpha_quality 0.9 -q:v 45 -tag:v hvc1 -pix_fmt bgra logo-dalmatian.mp4
echo "ALPHA CHECK (musi być 1): $(ffprobe -v error -show_entries stream_tags=alpha_mode -of csv=p=0 logo-dalmatian.webm)"
echo "ALL DONE: $(date)"
ls -lh logo-dalmatian.webm logo-dalmatian.mp4
