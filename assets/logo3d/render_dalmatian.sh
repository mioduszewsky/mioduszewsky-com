#!/bin/bash
set -e
cd ~/mioduszewsky-com/assets/logo3d
echo "START: $(date)"
blender -b fur.blend -o "$PWD/frames_dal/f_####" -F PNG -s 1 -e 180 -a
echo "RENDER DONE: $(date)"
# crf 28 / q:v 45, nie 34 / 58: futro to szum wysokiej częstotliwości i ginie w kompresji pierwszy.
ffmpeg -y -framerate 30 -i frames_dal/f_%04d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 28 -row-mt 1 logo-dalmatian.webm
ffmpeg -y -framerate 30 -i frames_dal/f_%04d.png -c:v hevc_videotoolbox -allow_sw 1 -alpha_quality 0.9 -q:v 45 -tag:v hvc1 -pix_fmt bgra logo-dalmatian.mp4
echo "ALPHA CHECK (musi być 1): $(ffprobe -v error -show_entries stream_tags=alpha_mode -of csv=p=0 logo-dalmatian.webm)"
echo "ALL DONE: $(date)"
echo "UWAGA: frames_dal/ zostaje (setki MB). Skasuj RĘCZNIE dopiero po akceptacji —"
echo "dzięki temu korekta kompresji to 2 minuty re-enkodowania, a nie 12 h renderu."
ls -lh logo-dalmatian.*
