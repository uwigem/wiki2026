#!/usr/bin/env python3
"""Shrink a PDF by downsampling its images and recompressing them.

The handbooks and guides linked from the Education page are exported straight
out of Google Docs, which embeds every picture at whatever resolution it was
pasted at and stores most of them Flate-compressed, which is to say barely
compressed at all. One 13-page export arrived at 11.7MB, 6.7MB of which was a
single image. These are downloads on a public wiki served off the iGEM
machines, so that matters.

Each embedded image is measured against the size it is actually drawn at, and
anything finer than `--ppi` is scaled down to it and stored as JPEG. Text,
vectors and the page structure are untouched, so the file stays selectable,
searchable and sharp when it is zoomed. Transparency masks follow the picture
they belong to.

Three things it is careful about:

- **Line art.** A picture that is nearly all pure black and pure white with no
  colour in it is a QR code or a pen drawing. JPEG rings around hard edges,
  and a rung QR code does not scan, so these keep 300ppi and are stored one
  bit per pixel, which is both lossless and smaller than the JPEG would be.
- **Images that are already fine.** A JPEG that is not over-sampled is left
  exactly as it is rather than decoded and re-encoded, which would only cost a
  generation for no gain.
- **Images whose colour space lies.** A greyscale JPEG declared `/DeviceRGB`
  draws as a third of itself stretched across the whole box, in every viewer.
  Rewriting it with the colour space the data really has repairs that, but it
  changes what the page shows, so it is reported rather than done quietly.

Usage:
    python3 scripts/shrink-pdf.py public/education/scientists.pdf
    python3 scripts/shrink-pdf.py in.pdf -o out.pdf --ppi 150 --quality 82

Needs `pikepdf` and `Pillow`, and `pdfimages` from poppler to measure how big
each picture actually lands on the page:
    pip3 install pikepdf Pillow
    brew install poppler
"""
from __future__ import annotations

import argparse
import io
import shutil
import subprocess
import sys
from pathlib import Path

try:
    import pikepdf
    from PIL import Image, ImageChops
except ImportError:  # pragma: no cover
    sys.exit("needs pikepdf and Pillow: pip3 install pikepdf Pillow")

CHANNELS = {"1": 1, "L": 1, "P": 1, "RGB": 3, "CMYK": 4}


def placed_ppi(pdf_path: Path) -> dict[int, float]:
    """Each image object's resolution *as placed on the page*, by object number.

    The stored pixel dimensions say nothing on their own: a 2048px image is
    either lavishly over-sampled or exactly right depending on how big it is
    drawn. `pdfimages -list` already works that out, which saves walking every
    content stream for its transformation matrix.
    """
    if not shutil.which("pdfimages"):
        sys.exit("needs pdfimages (brew install poppler)")
    out = subprocess.run(
        ["pdfimages", "-list", str(pdf_path)], capture_output=True, text=True, check=True
    ).stdout
    ppi: dict[int, float] = {}
    for line in out.splitlines()[2:]:
        f = line.split()
        if len(f) < 15:
            continue
        try:
            obj, x_ppi, y_ppi = int(f[-6]), float(f[-4]), float(f[-3])
        except ValueError:
            continue
        # One object can be drawn more than once, and a LOW figure here means
        # it is drawn BIG: fewer stored pixels per inch of page. The largest
        # placement is the one that has to stay sharp, so keep the smallest
        # number rather than the largest.
        here = min(x_ppi, y_ppi)
        ppi[obj] = min(ppi.get(obj, here), here)
    return ppi


def sample(img: Image.Image, cap: int = 500_000) -> Image.Image:
    """A copy small enough to measure quickly.

    Nearest-neighbour on purpose: a smooth resample blends the edges of line
    art into greys and the picture stops looking bilevel, which is the one
    thing the caller is trying to measure.
    """
    if img.width * img.height <= cap:
        return img
    k = max(2, int((img.width * img.height / cap) ** 0.5))
    return img.resize((max(1, img.width // k), max(1, img.height // k)), Image.NEAREST)


def is_line_art(img: Image.Image) -> bool:
    """Near-bilevel and colourless: a QR code, a pen drawing, a chart outline.

    Deliberately strict. A screenshot of a slide is mostly white too, but its
    text is grey at the edges and its furniture is coloured, and storing one of
    those a bit per pixel would wreck it.
    """
    small = sample(img)
    hist = small.convert("L").histogram()
    total = sum(hist) or 1
    # A little tolerance either side, because even a QR code out of a JPEG has
    # soft edges by the time it gets here.
    if (sum(hist[:12]) + sum(hist[244:])) / total < 0.965:
        return False
    if img.mode in ("L", "1"):
        return True
    # Ink is grey or it is not line art. This is the test that separates a QR
    # code from a slide screenshot: slides come out around 0.6 and up, drawn
    # line art at 0.1 and below.
    rgb = small.convert("RGB")
    diff = ImageChops.difference(rgb, rgb.convert("L").convert("RGB"))
    px = diff.getdata()
    return sum(sum(t) for t in px) / (len(px) * 3) < 0.3


def declared_components(obj) -> int | None:
    """How many samples per pixel the image's colour space promises."""
    cs = obj.get("/ColorSpace")
    if cs is None:
        return None
    if isinstance(cs, pikepdf.Name):
        return {
            "/DeviceGray": 1, "/CalGray": 1, "/G": 1,
            "/DeviceRGB": 3, "/CalRGB": 3, "/RGB": 3,
            "/DeviceCMYK": 4, "/CMYK": 4,
        }.get(str(cs))
    try:
        if isinstance(cs, pikepdf.Array) and len(cs) >= 2:
            family = str(cs[0])
            if family == "/ICCBased":
                return int(cs[1]["/N"])
            if family in ("/Indexed", "/I", "/Separation"):
                return 1
            if family == "/DeviceN":
                return len(cs[1])
    except Exception:
        return None
    return None


def is_jpeg(obj) -> bool:
    f = obj.get("/Filter")
    names = [str(f)] if isinstance(f, pikepdf.Name) else [str(x) for x in (f or [])]
    return "/DCTDecode" in names


def write_image(obj, img: Image.Image, quality: int, bilevel: bool) -> None:
    """Replace an image XObject's pixels in place, keeping its /SMask."""
    smask = obj.get("/SMask")
    if bilevel:
        bw = img.convert("L").point(lambda v: 255 if v >= 128 else 0).convert("1")
        # PIL packs mode "1" eight pixels to a byte with each row padded to a
        # byte boundary, which is exactly how PDF wants it. The raw bytes go in
        # and `compress_streams` deflates them when the file is saved.
        obj.write(bw.tobytes())
        obj.Width, obj.Height = bw.width, bw.height
        obj.ColorSpace = pikepdf.Name.DeviceGray
        obj.BitsPerComponent = 1
    else:
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=quality, optimize=True)
        obj.write(buf.getvalue(), filter=pikepdf.Name.DCTDecode)
        obj.Width, obj.Height = img.width, img.height
        obj.ColorSpace = (
            pikepdf.Name.DeviceGray if img.mode == "L" else pikepdf.Name.DeviceRGB
        )
        obj.BitsPerComponent = 8
    for key in ("/Decode", "/DecodeParms", "/Interpolate"):
        if key in obj:
            del obj[key]
    if smask is not None:
        obj.SMask = smask


def shrink(src: Path, dst: Path, target_ppi: float, quality: int, floor: int) -> int:
    ppi = placed_ppi(src)
    pdf = pikepdf.open(src)
    seen: set[int] = set()
    resized = rewritten = repaired = 0

    for page in pdf.pages:
        for _, obj in (page.resources.get("/XObject") or {}).items():
            if obj.get("/Subtype") != pikepdf.Name.Image:
                continue
            num = obj.objgen[0]
            if num in seen:
                continue
            seen.add(num)

            try:
                pil = pikepdf.PdfImage(obj).as_pil_image()
            except Exception as exc:  # an exotic filter we should not touch
                print(f"  obj {num}: left alone ({exc})")
                continue

            want_n, have_n = declared_components(obj), CHANNELS.get(pil.mode)
            broken = bool(want_n and have_n and want_n != have_n)
            if broken:
                repaired += 1
                print(
                    f"  obj {num}: REPAIRED. Its colour space claims {want_n} samples"
                    f" per pixel and the data has {have_n}, so this image does not"
                    f" render correctly in the original."
                )

            line = is_line_art(pil)
            want = max(target_ppi, 300) if line else target_ppi
            at = ppi.get(num, 0)
            scale = want / at if at > want else 1.0
            w = max(floor, round(pil.width * scale)) if scale < 1 else pil.width
            h = max(floor, round(pil.height * scale)) if scale < 1 else pil.height
            shrinking = (w, h) != (pil.width, pil.height)

            # Already a JPEG, already the right size, nothing wrong with it:
            # decoding and re-encoding would cost a generation for nothing.
            if not shrinking and not broken and not line and is_jpeg(obj):
                continue

            mask_pil = None
            if obj.get("/SMask") is not None:
                try:
                    mask_pil = pikepdf.PdfImage(obj.SMask).as_pil_image()
                except Exception:
                    mask_pil = None

            if shrinking:
                pil = pil.resize((w, h), Image.LANCZOS)
                resized += 1
            rewritten += 1

            before = len(obj.read_raw_bytes())
            write_image(obj, pil, quality, bilevel=line)
            after = len(obj.read_raw_bytes())
            was = f" (was {round(w / scale)}x{round(h / scale)})" if shrinking else ""
            kind = " line art" if line else ""
            print(f"  obj {num}: {w}x{h}{was}{kind}, {before // 1024}K -> {after // 1024}K stored")

            if mask_pil is not None:
                # A lossy mask shows as a halo around whatever it cuts out, and
                # masks are small, so this one stays eight-bit and lossless.
                mask_obj = obj.SMask
                mask_pil = mask_pil.convert("L")
                if mask_pil.size != (w, h):
                    mask_pil = mask_pil.resize((w, h), Image.LANCZOS)
                mask_obj.write(mask_pil.tobytes())
                mask_obj.Width, mask_obj.Height = w, h
                mask_obj.ColorSpace = pikepdf.Name.DeviceGray
                mask_obj.BitsPerComponent = 8
                for key in ("/Decode", "/DecodeParms", "/Interpolate"):
                    if key in mask_obj:
                        del mask_obj[key]
                seen.add(mask_obj.objgen[0])

    pdf.save(
        dst,
        compress_streams=True,
        object_stream_mode=pikepdf.ObjectStreamMode.generate,
        linearize=True,
    )
    pdf.close()
    a, b = src.stat().st_size, dst.stat().st_size
    print(
        f"{src.name}: {resized} resized, {rewritten - resized} recompressed, "
        f"{repaired} repaired, {a / 1e6:.2f}MB -> {b / 1e6:.2f}MB "
        f"({round(100 - b * 100 / a)}% smaller)"
    )
    return repaired


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("pdf", type=Path)
    ap.add_argument("-o", "--out", type=Path, help="default: alongside, .small.pdf")
    ap.add_argument("--ppi", type=float, default=150, help="target resolution on the page")
    ap.add_argument("--quality", type=int, default=82, help="JPEG quality")
    ap.add_argument("--floor", type=int, default=16, help="never go below this many pixels")
    args = ap.parse_args()
    out = args.out or args.pdf.with_suffix(".small.pdf")
    shrink(args.pdf, out, args.ppi, args.quality, args.floor)


if __name__ == "__main__":
    main()
