/**
 * The balance hedgehogs, as animation data.
 *
 * A pixel drawing of two hedgehogs sitting in the pans of a balance, joined by
 * a red leash. It is transcribed from the team artwork and taken apart into the
 * pieces that have to move independently: the pole and grass stay put, each pan
 * assembly swings with its end of the beam, and the beam and the leash are
 * redrawn every frame from geometry.
 *
 * Pulling it apart meant filling in pixels the original never had, because
 * something was sitting in front of them. The pole had no pixels behind the
 * leash, the left pan had none under it, and each end ball carried a stub of
 * beam from the one pose the drawing was in. Those are repaired here, so no
 * part of the scale shows a hole once it starts moving.
 *
 * Layers are run-length encoded. In `rows`, one line per pixel row, separated
 * by a vertical bar: a letter is an index into the palette (a is 1), a dot is
 * empty, and a number repeats the character that follows it. `x` and `y` are
 * where the layer's top-left corner sits in the 120 by 92 frame.
 *
 * The palette is stored without a leading hash, which is also why this file is
 * listed in the colour-rule exemptions in scripts/check-conventions.mjs: like
 * refSprites.ts, the colours here ARE the artwork, not styling choices.
 */

export interface LogoLayer {
  x: number
  y: number
  rows: string
}

export const BALANCE_LOGO = {
  w: 120,
  h: 92,
  /** Six-digit hex, no hash. Index 1 is the first entry. */
  palette: ["30223c", "3a734a", "428148", "4f3079", "4f8d48", "599a47", "5a2a2c", "5a5e60", "613e90", "65a945", "6d3233", "6e7376", "7fb654", "82c155", "855aa8", "8a433c", "ac7134", "ad84ce", "cd9465", "e6293d", "f3d1a9", "f4a7a6", "fba4b0"],
  /** The same artwork shifted for a green background. */
  paletteOnGreen: ["30223c", "245e38", "2a6b33", "4f3079", "367531", "3e7f2e", "5a2a2c", "5a5e60", "613e90", "488c26", "6d3233", "6e7376", "5f9635", "629f33", "855aa8", "8a433c", "ac7134", "ad84ce", "cd9465", "e6293d", "f3d1a9", "f4a7a6", "fba4b0"],
  /** Beam geometry: pivot point, half length, and the drawing's own tilt. */
  pivot: [60.5, 13.384],
  halfLength: 35.613,
  restAngle: 0.25645,
  /** Vertical offset that lines the drawn beam up with the original artwork. */
  beamOffset: -0.24,
  /** Palette indices for the four bands down the beam. */
  beam: {"edge": 9, "main": 15, "under": 9, "shadow": 4},
  /** Centres of the two end balls, which each pan assembly hangs from. */
  leftAnchor: [26.833, 4.556],
  rightAnchor: [95.73, 22.622],
  /** Cubic Bezier for the leash, in frame coordinates, plus its colour index. */
  leash: {"A": [39.0, 44.5], "D": [83.0, 48.5], "C1": [54.317, 44.305], "C2": [65.864, 31.503], "col": 20},
  /** Eye pixels, painted over with `faceColour` for a blink. */
  eyesLeft: [[37, 38], [37, 39]],
  eyesRight: [[90, 45], [90, 46]],
  faceColour: 21,
} as const

export const LOGO_LAYERS: Record<'pole' | 'grass' | 'ballLeft' | 'ballRight' | 'left' | 'right', LogoLayer> = {
  pole: {
    x: 57,
    y: 2,
    rows:
      '..4i|.iorroi|do3rooi|d6oi|d6oi|di4oid|.d4id|..4d|..dooi|..diid|..didd|..4o|..4o|..4i|..4d|..4d|.' +
      '.diid|..diid|..d3i|..dooi|..dooi|..dooi|..dooi|..dooi|..d3oi|..d3oi|..d3oi|..d3oi|..d3oi|.di3oi|' +
      '.d4oi|.d4oi|.d4oi|.d3ori|.d3ori|.d4oi|.d4oi|.d4oi|.d4oi|.d4oi|.d4oi|.d4oi|.d4oi|.d4oi|.d4oi|.d4o' +
      'i|.d4oi|.d4oi|.d4oi|.i4oi|.i6o|.i5oi|.i3orri|.i3orri|.i6o|.i6o|.i5oi|.i6o|.i5oi|.i5oi|.i6o|.i5oi' +
      '|.i5oi|.i6o|.i5oi|.i5oi|.i5oi|.i6o|ii5oi|ii5oii|ii5oid|ii5oid|ii5oid|ii5oid|iio3.oid|4i3.id|.4i3' +
      '.d|..3i3.d|3.iid|5.d|.d',
  },
  grass: {
    x: 2,
    y: 74,
    rows:
      '30.mm3.m|20.e10.mm..mm.mm29.mm11.ee18.ee|10.f8.e7.m3.mm..4m7.ee10.fjf4.m..mm4.f6.ee18.ee|10.fe5.' +
      'ee8.m3.e6m7.ee5.e6.fmm3.m.mmf5.fe3.eeb9.e7.ec|10.bee4.fb4.ee3.mm.f5mj6.3e3.eebehh4.jmm.m..mmf.m3' +
      '.bee..eeb10.ee4.ceb6.ee|4.ee4.beec..eeb3.ec4.fmm.f3mje..ff..ee3.eecbe3b3.lmm.j.fmf..mj..bee.ejb6' +
      '.ee3.bee3.efb5.ef3.ff|5.efc..bejcb.eb3.ebb.ee.emm.fmem5fb.ceb..eeb..eebjh3.fmme.jme.jc.mm.cjbefb' +
      '.eeb3.ee3.bff..eb..ec.ee4.e|5.beeb.cbjebcfb..efb.eeb..emffmemfcffcb.ceb.febb..bchfmfc.fmme.mmeej' +
      'j3m.bfbecfbeb4.becj.beebbfb.cfceeb3.fe|ee4.becffbecb5cecbeebfj.emmbmcjefjffnbcfebceb.cebch.cmmfc' +
      'jmebmmecjmmfcbbcbebfecb.eeb.bjbebcebbec3ebfb..efc|.eefc.bcebjbnnccbjbbcbjebbnfbcmmbmcefjjbbjbccj' +
      'bejbbjcbcbhbjmmcjmebmmecmmfbcbnc3bnnbefebfcbfbbj3nbcebebbcfb.fe3.ee|..bfe3bfb3njbbejbfjnjbbffcbb' +
      'embff3mfbcebcbeennceebbcbcbcemmbmjbmmbmmjbbebnnbbnnjbjfbbejbbc3njebcnnbbfnnbfjb..ec|3.cfjebc3nfc' +
      'cbecfnnjcbfeccjnbmbe3mfbcnn3bfnnfbe4bjbecbfmcmmbmecmmbcjebcnbnnjbbebfjbeeb3njccbcfnbfnnfbecbffcb' +
      '|bb.bbjnjbnnjbbcbccnnjcbb3cnnfbfcmmfe3bjnnbbnnf3bnbbjjbejjcmmcjbmbjmfbffnjcfnnjbbfcnncbbeennfc3b' +
      'cbjfnneb3cnnbfbb|4bfbjnbnjceebnbjnjebjbb3njbebemmbfnbbcjnccnfbjcbnbjjfbbejcfjbfbmbjfcjebjnnbnjcb' +
      'ccnnjbncbnnjcecbn3bnnjbfnbcnfbfbb|.3bfbenjnjbeebnbjnjebjbjnnjbbebjmmbenb3c3jnjbjcbnejfcbbfjcbjec' +
      'bfbjbjjbbcjnjnjbeejnjbbjcbnnebeccnbbjnjcbnjbjj4b|..3bcb3jcb3cecjjecbcbfjjc4bjjcbce4bf3jcbebejee6' +
      'bcbee4bebcc3bc3jc3bjjcbbebejjbbecbebcjjebbfbbjc3b',
  },
  ballLeft: {
    x: 23,
    y: 2,
    rows:
      '.3i|iorroi|i4oi|diooid|.3d.d',
  },
  ballRight: {
    x: 94,
    y: 20,
    rows:
      '.4i|.orro|iorroi|i4oi|diooid|.4d',
  },
  left: {
    x: 9,
    y: 6,
    rows:
      '18.h|16.3h|16.3h|15.hl3h|15.lh.hl|14.hlh.hlh|14.hl3.hl|14.lh3.hl|13.hl4.hll|13.lh5.hl|13.ll5.hl|' +
      '12.hll6.hh|12.lh7.hl|11.hl8.hll|10.hlh9.hl|10.3l9.hll|10.3l9.hll|9.hll11.hl|9.3l11.hll|8.llh13.l' +
      'h|8.hl14.hl|8.lh14.hll|7.hl9.ggk.gg.hhl|7.lh6.gg.gqqggqghgg|7.lh6.gqkppqqpqqkpqgl|6.hl5.ggkpqqpp' +
      'qqpqqpqqpg|6.ll5.kqqpp3qpq3p5qg|5.hll3.3gpqqppqqppqqppqpqqg|5.hll3.gk3pqq3pqp3s5pqg|5.lh5.kqq8ps' +
      'uupvuspqg|4.hl4.g3pqqppqq3pkuw5usv|4.lh4.gk12pk7uv|4.lh5.gkqqpk6p5ua3uv|3.hl5.gk4pqq4pq5ua4u|3.h' +
      'l5.g3kpqqppqpk4uwuw5u|..hlh6.l5k3pkvvuut7uaa|..3h7.lgvus5gsv3tu5v|12idi3s5dss4t9d|io3r20o5t6oi|i' +
      '25o4t5oid|.dorr28oiid|..di28oid|3.di26oid|4.ddi22oiid|6.ddi19odd|8.3di13oidd|12.13d',
  },
  right: {
    x: 76,
    y: 25,
    rows:
      '17.hh|16.4h|16.llhl|15.hlhhlh|15.ll..hl|15.lh..hl|14.hl4.lh|14.lh4.hll|13.hlh4.h3l|13.hl6.hll|13' +
      '.lh6.hll|12.hlh6.hll|12.lh8.hl|11.hlh8.hlhh|11.hl3.g.gg..ghhl|11.lh..gqgqq3kghh|10.hl..gqppqpqqk' +
      '3g|10.lh..g3k5pqphl|9.hlh.s4ukkuupqqgh|9.hl.s7uvvkppqgl|9.aassua5us4pkhl|8.haa3uauw4uvpqqpgl|8.l' +
      'hvuauuww5uk3pqgh|7.hl..a10us4pgl|7.ht3.k9uspqqghl|6.hltt.gk9uspqqk.lh|6.hl.3tk10usppqghl|6.lh..t' +
      '3s4u3suus3pghlh|5.hl..gk7us4uspqk..hl|5.lh3.g3utvuus4usppqg.hlh|5.lh..gkk3tv3ussuus3pg..hl|4.hlh' +
      '..gpkut9uspqkg..hl|4.lh3.lkk11uspqg4.hh|3.hll4.gkp9us3pk4.hl|3.hl6.gp9uqppgg5.ll|..hlh6.ggs8u3pg' +
      '6.hl|11idsuss3gquuq3g10i|io4r6o4s4ossoiiorr7oi|di32oid|.doorr27oid|..dior26oid|3.dii24oiid|4.dd3' +
      'i19oiidd|6.dd4i12o5id|8.3d14i3d|11.14d',
  },
}

/**
 * One hedgehog on its own, lifted out of the balance artwork.
 *
 * The same drawing as the right-hand hedgehog in the logo, with the pan, the
 * hanging strings and the grass filtered out by colour.
 *
 * The red leash it grips in the logo is left out. In the logo it reads as one
 * hedgehog holding a rope to another; on its own beside a paragraph it looks
 * like something has gone wrong with the animal. The paw and belly pixels the
 * leash covered are filled with skin. The face is exactly as drawn.
 *
 * This exists because the garden engine's own hedgehog is drawn from ABOVE, for
 * a top-down world. Stood next to a speech bubble it reads as a hedgehog lying
 * on its back. This one is a side view, so it can sit beside text and look like
 * it is sitting.
 */
export const HEDGEHOG_SIDE: LogoLayer = {
  x: 0,
  y: 0,
  rows:
    '7.g.gg..g|6.gqgqq3kg|5.gqppqpqqk3g|5.g3k5pqp|4.s4ukkuupqqg|3.s7uvvkppqg|aassua5us4pk|aa3' +
    'uauw4uvpqqpg|.vuauuww5uk3pqg|..a10us4pg|3.k9uspqqg|..gk9uspqqk|3.k10usppqg|..3s4u3suus3p' +
    'g|gk7us4uspqk|.g7us4usppqg|gkk7ussuus3pg|gpk11uspqkg|.kk11uspqg|.gkp9us3pk|..gp9uqppgg|.' +
    '.ggs8u3pg|3.suss3gquuq3g|3.4s4.ss',
}

/** Pixel size of 19 by 24, for laying out around it. */
export const HEDGEHOG_SIDE_SIZE = { w: 19, h: 24 } as const

/** Expands one run-length encoded layer into [x, y, paletteIndex] triples. */
export function decodeLayer(layer: LogoLayer): Int16Array {
  const out: number[] = []
  layer.rows.split('|').forEach((row, j) => {
    let x = layer.x
    let run = ''
    for (const ch of row) {
      if (ch >= '0' && ch <= '9') {
        run += ch
        continue
      }
      const n = run ? Number(run) : 1
      run = ''
      for (let i = 0; i < n; i++) {
        if (ch !== '.') out.push(x, layer.y + j, ch.charCodeAt(0) - 96)
        x++
      }
    }
  })
  return Int16Array.from(out)
}
