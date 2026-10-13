import { useEffect, useRef } from 'react'
import { BALANCE_LOGO, HEDGEHOG_SIDE, HEDGEHOG_SIDE_SIZE, decodeLayer } from '../../content/balanceLogo'

const { w: HOG_W, h: HOG_H } = HEDGEHOG_SIDE_SIZE

/** The guide, small, beside what it is saying. The same drawing as HedgehogNote. */
export default function Hog({ scale = 2 }: { scale?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    canvas.width = HOG_W
    canvas.height = HOG_H
    const img = ctx.createImageData(HOG_W, HOG_H)
    const cells = decodeLayer(HEDGEHOG_SIDE)
    for (let i = 0; i < cells.length; i += 3) {
      const n = parseInt(BALANCE_LOGO.palette[cells[i + 2] - 1], 16)
      const o = (cells[i + 1] * HOG_W + cells[i]) * 4
      img.data[o] = (n >> 16) & 255
      img.data[o + 1] = (n >> 8) & 255
      img.data[o + 2] = n & 255
      img.data[o + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
  }, [])
  return (
    <canvas ref={canvasRef} aria-hidden className="pixelated shrink-0" style={{ width: HOG_W * scale, height: HOG_H * scale }} />
  )
}
