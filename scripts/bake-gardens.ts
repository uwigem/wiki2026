/**
 * Draws every page's background and saves it under public/gardens/.
 *
 *   npm run gardens
 *
 * Run it after adding a page, or after changing the garden recipe in
 * src/site/garden/generate.ts. The output directory is ignored by git: upload
 * the PNGs through the wiki Uploads tool into the `gardens/` directory on the
 * CDN, which re-encodes them as AVIF, and that is what the site shows (see
 * src/site/cdn.ts). The site never draws a garden at load time.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'
import { GARDEN_ROUTES, LAWN_FILE, gardenFile } from '../src/site/garden/gardens'
import { bakeLawn, bakeStrips, type Bitmap } from '../src/site/garden/generate'

/* A small PNG encoder (RGBA, 8 bits per channel), so the script needs nothing
   beyond Node itself. Each row is filtered whichever way compresses it best,
   the usual heuristic. */

const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type: string, data: Uint8Array): Buffer {
  const out = Buffer.alloc(12 + data.length)
  out.writeUInt32BE(data.length, 0)
  out.write(type, 4, 'ascii')
  Buffer.from(data).copy(out, 8)
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length)
  return out
}

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
}

function encodePng(bm: Bitmap): Buffer {
  const { width: w, height: h, data } = bm
  const stride = w * 4
  const raw = Buffer.alloc((stride + 1) * h)
  const line = new Uint8Array(stride)
  for (let y = 0; y < h; y++) {
    const cur = data.subarray(y * stride, (y + 1) * stride)
    const prev = y > 0 ? data.subarray((y - 1) * stride, y * stride) : new Uint8ClampedArray(stride)
    let best = 0
    let bestScore = Infinity
    let bestLine: Uint8Array = line
    for (let f = 0; f < 5; f++) {
      const out = new Uint8Array(stride)
      let score = 0
      for (let i = 0; i < stride; i++) {
        const a = i >= 4 ? cur[i - 4] : 0
        const b = prev[i]
        const c = i >= 4 ? prev[i - 4] : 0
        const pred = f === 0 ? 0 : f === 1 ? a : f === 2 ? b : f === 3 ? (a + b) >> 1 : paeth(a, b, c)
        const v = (cur[i] - pred) & 0xff
        out[i] = v
        score += v < 128 ? v : 256 - v
      }
      if (score < bestScore) {
        bestScore = score
        best = f
        bestLine = out
      }
    }
    raw[y * (stride + 1)] = best
    Buffer.from(bestLine).copy(raw, y * (stride + 1) + 1)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', new Uint8Array(0)),
  ])
}

mkdirSync('public/gardens', { recursive: true })

const kb = (b: Buffer) => `${(b.length / 1024).toFixed(1)} KB`
const lawn = encodePng(bakeLawn())
writeFileSync(`public/${LAWN_FILE}`, lawn)
console.log(`${LAWN_FILE.padEnd(40)} ${kb(lawn)}`)

let total = lawn.length
for (const path of GARDEN_ROUTES) {
  const file = gardenFile(path)!
  const png = encodePng(bakeStrips(path))
  writeFileSync(`public/${file}`, png)
  total += png.length
  console.log(`${file.padEnd(40)} ${kb(png)}`)
}
console.log(`${GARDEN_ROUTES.length} pages, ${(total / 1024).toFixed(0)} KB in all`)
