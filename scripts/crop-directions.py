#!/usr/bin/env python3
"""Crop the 4 'directions' originals to the 455:606 portrait slot, high-res, matching current framing."""
from PIL import Image
import os

SRC_DIR = "/Users/krollipolli/Documents/Github/RePanel site/2/4 приминения"
OUT_DIR = "/Users/krollipolli/Documents/Github/RePanel site/repanel-site/public/images"

AR = 455 / 606  # target width/height ≈ 0.7508 (portrait)
OUT_W = 1080     # output width px (≈3x display) -> height = 1438

# (src filename, out name, cx_frac, cy_frac, cropH_frac)
# cropH_frac = fraction of source HEIGHT used as crop height; crop width = cropH*AR
JOBS = [
    ("ro0286.jpg",                              "dir-panely.jpg",    0.50, 0.625, 0.70),  # panel stack
    ("Generated Image June 08, 2026 - 11_45AM.jpg", "dir-resheniya.jpg", 0.50, 0.46, 0.72),  # blue round table
    ("Generated Image June 02, 2026 - 9_15AM.jpg",  "dir-magazin.jpg",   0.50, 0.54, 0.84),  # rocking horse
    ("Generated Image May 29, 2026 - 7_40PM.jpg",   "dir-proekt.jpg",    0.58, 0.52, 1.00),  # kitchen scene
]

def crop_one(src, out, cxf, cyf, chf):
    im = Image.open(src).convert("RGB")
    W, H = im.size
    cropH = chf * H
    cropW = cropH * AR
    if cropW > W:  # don't exceed width; clamp and recompute height
        cropW = W
        cropH = cropW / AR
    cx, cy = cxf * W, cyf * H
    left = cx - cropW / 2
    top = cy - cropH / 2
    # clamp into image
    left = max(0, min(left, W - cropW))
    top = max(0, min(top, H - cropH))
    box = (round(left), round(top), round(left + cropW), round(top + cropH))
    cropped = im.crop(box)
    out_h = round(OUT_W / AR)
    cropped = cropped.resize((OUT_W, out_h), Image.LANCZOS)
    path = os.path.join(OUT_DIR, out)
    cropped.save(path, "JPEG", quality=90, optimize=True, progressive=True)
    kb = os.path.getsize(path) // 1024
    print(f"{out}: src {W}x{H} -> crop {box} -> {OUT_W}x{out_h}  ({kb} KB)")

for src, out, cxf, cyf, chf in JOBS:
    crop_one(os.path.join(SRC_DIR, src), out, cxf, cyf, chf)
print("done")
