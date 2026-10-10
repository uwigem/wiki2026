/**
 * A single-colour pixel glyph: a grid of characters, `#` for a set pixel,
 * turned into runs of rectangles so it stays crisp at any size and costs a
 * handful of DOM nodes. It draws in `currentColor`.
 */

/** Horizontal runs of set pixels in a row, as [start, length]. */
function runs(row: string): [number, number][] {
  const out: [number, number][] = []
  let start = -1
  for (let x = 0; x <= row.length; x++) {
    const on = row[x] === '#'
    if (on && start < 0) start = x
    if (!on && start >= 0) {
      out.push([start, x - start])
      start = -1
    }
  }
  return out
}

export default function PixelIcon({ rows, className = 'h-10 w-10 shrink-0' }: { rows: string[]; className?: string }) {
  const w = rows[0].length
  return (
    <svg
      viewBox={`0 0 ${w} ${rows.length}`}
      className={className}
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {rows.flatMap((row, y) =>
        runs(row).map(([x, len]) => <rect key={`${y}-${x}`} x={x} y={y} width={len} height={1} />),
      )}
    </svg>
  )
}
