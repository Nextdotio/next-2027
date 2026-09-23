#!/usr/bin/env python3
"""Build the brand walls from pristine logo sources.

Input:  logo-src/{operators,partners,members}/  untouched copies of the logo
        files published on the sibling sites. This is the only input.
Output: public/logos/{operators,partners,members}/  the wall files
        src/logos.js                                the manifest + TOTAL_BRANDS
        src/logo-metrics.js                         via scripts/logo_metrics.py

The walls render logos white on charcoal. A flat CSS whiteout
(brightness(0) invert(1)) turns any white-text-on-colour logo into a solid
block, so every PNG is baked to a structure-preserving white mark instead:
luminance maps to opacity, and badges keep their letterforms as cut-outs.

- auto  (default) the alpha-weighted median luminance of the design picks the
        polarity: a dark/coloured design keeps its dark pixels (alpha =
        darkness), a light design (a white wordmark made for dark sites) keeps
        its light pixels (alpha = lightness);
- dark / light   force that polarity;
- shape  every opaque pixel is ink (alpha = the source's own alpha), for
        multi-colour marks on transparency whose dark and light parts would
        each vanish under a single polarity (a black wordmark beside a gold or
        yellow emblem); their counters are already transparent in the source;
- paper  every colour is ink and only white is paper (alpha = 1 - the
        smallest RGB channel): the same fix for a mark whose white details
        must stay cut out;
- plate  for a design printed on a solid plate or background: the plate colour
        (the design's most common colour) drops out and whatever is printed
        on it becomes the mark, so it cannot render as a solid white panel.

Every mode ends with the same normalise-and-contrast step, so the walls read as
one family. SVGs are copied through untouched (they use the .logo-sil CSS
whiteout on the page).

Idempotent by construction: each run rebuilds every wall file from logo-src
and never reads a wall PNG as input, so rerunning cannot re-bake (and degrade)
a mark. A file whose pixels are unchanged is not rewritten, and a wall file
with no source in logo-src is deleted, so the walls always mirror logo-src
exactly. To add a logo, drop the untouched source into logo-src/<wall>/ and
rerun; set a TREATMENT entry only if the auto result drops part of the mark.
"""
import json
import os
import re
import sys

import numpy as np
from PIL import Image

sys.dont_write_bytecode = True  # keep scripts/ free of __pycache__
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import logo_metrics  # noqa: E402  (trims to the content box and writes src/logo-metrics.js)

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'logo-src')
OUT = os.path.join(ROOT, 'public', 'logos')
MANIFEST = os.path.join(ROOT, 'src', 'logos.js')
WALLS = [('operators', 'OPERATORS'), ('partners', 'PARTNERS'), ('members', 'MEMBERS')]
RASTER = ('.png', '.jpg', '.jpeg', '.webp')

# Logos the auto rule gets wrong. Everything else is 'auto'.
TREATMENT = {
    # gold / yellow emblem beside a black wordmark: auto keeps one and drops the other
    'operators/BetMGM.png': 'shape',
    'operators/estrelabet.png': 'shape',
    'operators/gamingtec.png': 'shape',
    'operators/highbet.png': 'shape',
    'partners/golden-whale.png': 'shape',
    'partners/highbet.png': 'shape',
    'partners/pateplay.png': 'shape',
    'operators/latamwin.png': 'paper',  # tiny source: white gaps keep the letters apart
    # printed on a solid plate, which auto turns into a white panel (or, for
    # maxbet, a blank badge: its red letters sit on a red banner)
    'operators/maxbet.png': 'plate',
    'partners/casino-guru-awards.png': 'plate',
    'partners/finnplay.png': 'plate',
    'partners/the-playa.png': 'plate',
    'partners/vallettapay.png': 'plate',
    # flattened onto a white canvas, which auto reads as a light design
    'operators/white-hat-gaming.png': 'dark',
    'partners/chargeforwards.png': 'dark',
    'partners/gamecheck.png': 'dark',
}

# TOTAL_BRANDS counts each brand once across all three walls. Filenames are
# normalised (case and punctuation dropped, so gaming-malta = gamingmalta and
# l-l-europe = ll-europe); ALIASES then maps the remaining spellings of one
# brand onto a single key. Two files in the same wall with the same key fail
# the build: that is a duplicate logo.
ALIASES = {
    'll': 'lleurope',                # partners/l-l.png is L&L Europe
    'glitnorgroup': 'glitnor',
    'pressentergroup': 'pressenter',
}


def brand_key(filename):
    key = re.sub(r'[^a-z0-9]', '', os.path.splitext(filename)[0].lower())
    return ALIASES.get(key, key)


def plate_ink(rgb, alpha):
    """Contrast against the plate: the design's most common opaque colour.

    Distance from the plate colour, scaled so the typical printed colour is
    full ink. Scaling by the median (not the peak) keeps a multi-colour print
    - red letters, a gold ring, yellow stars - evenly bright instead of letting
    a few white specks set the scale; anti-aliased edges keep their ramp.
    """
    solid = alpha >= 0.9
    bins = (rgb[solid] * 255).astype(int) // 32
    _, which, counts = np.unique(bins, axis=0, return_inverse=True, return_counts=True)
    plate = np.median(rgb[solid][which.ravel() == counts.argmax()], axis=0)
    dist = np.sqrt(((rgb - plate) ** 2).sum(axis=-1) / 3.0)
    printed = dist[(alpha >= 0.5) & (dist > 0.1)]
    return np.clip(dist / np.median(printed), 0, 1) if printed.size else dist


def bake(im, mode='auto'):
    """Return (white-mark RGBA image, mode used) for one source image."""
    a = np.asarray(im.convert('RGBA')).astype(np.float64) / 255.0
    alpha = a[..., 3]
    if (alpha > 0.15).sum() == 0:
        return None, 'empty'
    rgb = a[..., :3]
    lum = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
    if mode == 'auto':
        w = alpha.copy()
        w[w < 0.15] = 0
        mode = 'light' if np.median(lum[w > 0]) >= 0.62 else 'dark'
    if mode == 'light':
        ink = lum
    elif mode == 'dark':
        ink = 1.0 - lum
    elif mode == 'shape':
        ink = np.ones_like(lum)
    elif mode == 'paper':
        ink = 1.0 - rgb.min(axis=-1)
    elif mode == 'plate':
        ink = plate_ink(rgb, alpha)
    else:
        raise ValueError(f'unknown treatment {mode!r}')
    ink = ink * alpha
    # normalise + gentle contrast so mid-tones don't render muddy
    peak = ink.max()
    if peak > 0:
        ink = ink / peak
    ink = np.clip((ink - 0.12) / 0.76, 0, 1) ** 0.9
    out = np.zeros_like(a)
    out[..., :3] = 1.0
    out[..., 3] = ink
    return Image.fromarray((out * 255).astype(np.uint8)), mode


def same_pixels(path, im):
    if not os.path.exists(path):
        return False
    old = Image.open(path)
    return old.size == im.size and np.array_equal(np.asarray(old.convert('RGBA')), np.asarray(im))


def plan_wall(wall):
    """[(source file, wall file)] for one wall, in manifest order.

    Checked before anything is written: two files in one wall that
    normalise to the same brand stop the build, since that is a duplicate.
    """
    items = []
    for f in os.listdir(os.path.join(SRC, wall)):
        stem, ext = os.path.splitext(f)
        if ext.lower() == '.svg':
            items.append((f, f))
        elif ext.lower() in RASTER:
            items.append((f, stem + '.png'))
    items.sort(key=lambda item: item[1])
    keys = {}
    for _, name in items:
        keys.setdefault(brand_key(name), []).append(name)
    dupes = [names for names in keys.values() if len(names) > 1]
    if dupes:
        sys.exit(f'error: the same brand appears twice in the {wall} wall: {dupes}')
    return items


def build_wall(wall, items):
    src_dir, out_dir = os.path.join(SRC, wall), os.path.join(OUT, wall)
    os.makedirs(out_dir, exist_ok=True)
    files, counts, written = [], {}, 0
    for f, name in items:
        dest = os.path.join(out_dir, name)
        if name.endswith('.svg'):
            data = open(os.path.join(src_dir, f), 'rb').read()
            if not os.path.exists(dest) or open(dest, 'rb').read() != data:
                open(dest, 'wb').write(data)
                written += 1
            files.append(name)
            counts['svg'] = counts.get('svg', 0) + 1
            continue
        im, mode = bake(Image.open(os.path.join(src_dir, f)), TREATMENT.get(f'{wall}/{name}', 'auto'))
        box = logo_metrics.content_box(np.asarray(im)[..., 3]) if im is not None else None
        if box is None:
            print(f'note: {wall}/{f} has no visible pixels - skipped')
            continue
        im = im.crop(box)
        if not same_pixels(dest, im):
            im.save(dest, optimize=True)
            written += 1
        files.append(name)
        counts[mode] = counts.get(mode, 0) + 1
    stale = [f for f in os.listdir(out_dir) if f not in files]
    for f in stale:
        os.remove(os.path.join(out_dir, f))
    print(f'{wall}: {len(files)} logos {counts}, {written} written, {len(stale)} removed')
    return files


if __name__ == '__main__':
    plans = {wall: plan_wall(wall) for wall, _ in WALLS}
    walls = {wall: build_wall(wall, plans[wall]) for wall, _ in WALLS}
    total = len({brand_key(f) for files in walls.values() for f in files})
    with open(MANIFEST, 'w', encoding='utf-8') as fh:
        fh.write('// generated by scripts/build_logos.py from logo-src/ - do not edit by hand\n')
        for wall, const in WALLS:
            fh.write(f'export const {const} = {json.dumps(walls[wall])}\n')
        fh.write('// unique brands across all three walls (a brand on two walls counts once)\n')
        fh.write(f'export const TOTAL_BRANDS = {total}\n')
    print(f'manifest: {sum(len(v) for v in walls.values())} wall files, {total} unique brands -> src/logos.js')
    logo_metrics.main()
