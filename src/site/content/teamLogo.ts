/**
 * The team logo: two hedgehogs on a balance, in one colour.
 *
 * This is the one-colour version of the balance drawing, with the right-hand
 * hedgehog's spines thickened so it still reads as an animal at small sizes. It
 * is the mark used in the navigation and as the browser-tab icon. The animated,
 * full-colour drawing is a separate thing, in `balanceLogo.ts`.
 *
 * Stored as pixels rather than as an image file, the way the rest of the site
 * draws itself. In `rows`, one entry per pixel row separated by a vertical bar:
 * `#` is ink, `.` is empty, and a number repeats the character after it.
 *
 * The colour is the logo's own purple, stored without a leading hash. Like the
 * other artwork files it is listed in the colour exemptions in
 * scripts/check-conventions.mjs: it is the artwork, not a styling choice.
 *
 * To change the logo, regenerate this file from the logo source rather than
 * editing the rows by hand. The strings are fixed-width chunks: a text wrapper
 * that breaks lines on spaces would corrupt them.
 */

export const TEAM_LOGO = {
  width: 103,
  height: 88,
  /** Six-digit hex, no hash. */
  ink: '4f3079',
  rows:
    '15.3#32.4#|14.6#29.6#|14.6#28.8#|14.10#24.8#|15.13#20.8#|16.16#16.8#|16.3#.16#13.6#|15.5' +
    '#4.16#10.4#|15.##.##8.15#7.4#|14.3#.3#11.15#3.4#|14.##3.##15.18#|14.##3.##19.15#|13.##4.' +
    '3#21.16#|13.##5.##25.15#|13.##5.##28.16#|12.3#6.##27.4#.15#|12.##7.##27.4#5.15#|11.##8.3' +
    '#26.4#8.16#|10.3#9.##26.4#12.15#5.4#|10.3#9.3#25.4#16.15#.4#|10.3#9.3#25.4#20.17#|9.3#11' +
    '.##25.4#24.13#|9.3#11.3#24.4#27.10#|8.3#13.##24.4#30.6#|8.##14.##24.5#28.4#|8.##14.3#23.' +
    '5#28.4#|7.##9.3#.##.3#22.5#27.6#|7.##6.##.10#22.5#27.##..##|7.##6.15#20.5#27.##..##|6.##' +
    '5.18#18.6#26.##4.##|6.##5.19#17.6#26.##4.3#|5.3#3.21#17.6#25.3#4.4#|5.3#3.12#3.7#16.6#25' +
    '.##6.3#|5.##5.11#3.#3.3#16.6#25.##6.3#|4.##4.14#8.#16.6#24.3#6.3#|4.##4.15#7.#16.6#24.##' +
    '8.##|4.##5.12#5.#3.#16.6#23.3#8.4#|3.##5.13#5.#3.#16.9#20.##3.#.##..4#|3.##5.12#11.#12.1' +
    '6#16.##..11#|..3#6.10#4.#7.##9.11#3.8#11.##..12#|..3#7.##3.5#..3#5.#8.6#..6#8.5#9.##..13' +
    '#|14#3.5#..13#..4#6.6#12.3#6.3#.#..11#|40#9.6#14.##5.##.#3.12#|37#12.6#15.##4.3#..#3.10#' +
    '|.35#13.6#16.##..3#3.#5.8#|..32#15.6#17.6#.#7.9#|3.30#16.6#18.3#..#9.8#|4.28#17.6#19.##3' +
    '.#8.8#|6.24#19.6#18.4#.##8.6#.##|8.20#21.6#18.##.4#9.8#|12.13#24.7#17.##..#11.9#|49.7#16' +
    '.##..##11.5#..##|49.7#16.##3.#3.#7.6#.3#|49.7#16.##..6#7.6#..##|49.7#15.3#..3#.#8.6#..##' +
    '|49.7#15.##3.3#10.5#4.##|49.7#14.3#4.3#8.6#4.##|49.7#14.##6.##3.11#5.##|49.7#13.3#6.##3.' +
    '10#6.##|49.7#11.12#4.20#|49.7#11.12#4.20#|49.7#11.36#|49.7#12.34#|49.7#13.32#|49.7#14.30' +
    '#|49.7#15.28#|49.7#17.24#|49.7#19.20#|48.8#22.14#|48.9#|48.9#|48.9#|48.9#|48.9#5.#|39.##' +
    '7.9#.#..##|38.##5.#..9#.#.3#5.##|29.##6.3#3.15#..3#.#3.3#..#|27.4#..##..##3.16#.3#..##..' +
    '3#.3#|25.10#.3#..3#..12#.3#.##.##.6#.3#|22.13#.3#.4#..12#.9#.9#|20.#.21#.34#.3#|18.67#|1' +
    '6.71#|15.73#|13.77#|12.79#|12.79#|12.79#',
} as const

/** Every ink pixel as a horizontal run: x, y and length. Computed once. */
export function logoRuns(): [number, number, number][] {
  const runs: [number, number, number][] = []
  TEAM_LOGO.rows.split('|').forEach((row, y) => {
    let x = 0
    let count = ''
    for (const ch of row) {
      if (ch >= '0' && ch <= '9') {
        count += ch
        continue
      }
      const n = count ? Number(count) : 1
      count = ''
      if (ch === '#') {
        const last = runs[runs.length - 1]
        if (last && last[1] === y && last[0] + last[2] === x) last[2] += n
        else runs.push([x, y, n])
      }
      x += n
    }
  })
  return runs
}

/**
 * The logo as one SVG path, in pixel units. A single path rather than one
 * rectangle per run, so that when it is drawn small and antialiased, the edges
 * shared between rows blend together instead of showing hairline seams.
 */
export function logoPath(): string {
  return logoRuns()
    .map(([x, y, n]) => `M${x} ${y}h${n}v1h-${n}z`)
    .join('')
}
