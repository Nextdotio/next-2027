#!/usr/bin/env python3
"""Normalise wall logos to structure-preserving white marks.

The walls render logos white on charcoal. A flat CSS whiteout
(brightness(0) invert(1)) turns any white-text-on-colour logo into a solid
block. Instead, this script bakes a white version per logo where luminance
maps to opacity, so badges keep their letterforms as cut-outs:

- dark-design logos (most wordmarks): alpha = darkness -> white shape,
  white/light text inside a badge becomes transparent counters;
- light-design logos (white wordmarks for dark sites): alpha = lightness.

The decider is the alpha-weighted median luminance of the design. Output
overwrites the PNG in place (white RGB + computed alpha), normalised so the
strongest pixel is fully opaque. Rerun after adding logos; sources remain
in the sibling repos.
"""
import os, sys
import numpy as np
from PIL import Image

DIRS = ['public/logos/operators', 'public/logos/partners', 'public/logos/members']

def process(path):
    im = Image.open(path).convert('RGBA')
    a = np.asarray(im).astype(np.float64) / 255.0
    alpha = a[..., 3]
    if (alpha > 0.15).sum() == 0:
        return 'empty'
    rgb = a[..., :3]
    lum = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
    w = alpha.copy()
    w[w < 0.15] = 0
    med = np.median(lum[w > 0])
    if med >= 0.62:
        ink = lum          # light design: keep the light pixels
        mode = 'light'
    else:
        ink = 1.0 - lum    # dark/coloured design: keep the dark pixels
        mode = 'dark'
    ink = ink * alpha
    # normalise + gentle contrast so mid-tones don't render muddy
    peak = ink.max()
    if peak > 0:
        ink = ink / peak
    ink = np.clip((ink - 0.12) / 0.76, 0, 1) ** 0.9
    out = np.zeros_like(a)
    out[..., :3] = 1.0
    out[..., 3] = ink
    Image.fromarray((out * 255).astype(np.uint8)).save(path)
    return mode

if __name__ == '__main__':
    counts = {}
    for d in DIRS:
        for f in sorted(os.listdir(d)):
            if f.lower().endswith('.png'):
                m = process(os.path.join(d, f))
                counts[m] = counts.get(m, 0) + 1
            elif f.lower().endswith('.svg'):
                print('note: svg left untouched:', f)
    print('processed:', counts)
