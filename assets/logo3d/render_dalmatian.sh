#!/bin/bash
set -e
cd ~/mioduszewsky-com/assets/logo3d
echo "START: $(date)"
blender -b fur.blend -o "$PWD/frames_dal/f_####" -F PNG -s 1 -e 180 -a
echo "RENDER DONE: $(date)"
ffmpeg -y -framerate 30 -i frames_dal/f_%04d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 34 -row-mt 1 logo-dalmatian.webm
ffmpeg -y -framerate 30 -i frames_dal/f_%04d.png -c:v hevc_videotoolbox -allow_sw 1 -alpha_quality 0.7 -q:v 58 -tag:v hvc1 -pix_fmt bgra logo-dalmatian.mp4
echo "ALPHA CHECK (musi być 1): $(ffprobe -v error -show_entries stream_tags=alpha_mode -of csv=p=0 logo-dalmatian.webm)"
rm -rf frames_dal
echo "ALL DONE: $(date)"
ls -lh logo-dalmatian.*
