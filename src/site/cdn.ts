/**
 * Where the wiki's uploaded files live.
 *
 * A wiki repository may not store images or documents: iGEM rejects the push,
 * and asks for them on its CDN instead. They go up through the wiki Uploads
 * tool (https://teams.igem.org/go/deliverables/wiki/uploads), which keeps the
 * directory and file name but re-encodes JPEG and PNG as AVIF, so a `.jpg` or
 * `.png` here becomes a `.avif` there. WebP, SVG and PDF are left as they are.
 *
 * This is the one place the team's CDN address is written. The router, the
 * PDF viewer and the build (which preloads each page's garden) all read it.
 */

/** The team's iGEM number, which is also its directory on the CDN. */
export const TEAM_ID = 6229

export const CDN = `https://static.igem.wiki/teams/${TEAM_ID}/wiki/`

const TO_AVIF = /\.(jpe?g|png)$/i

/** The CDN address of an uploaded file, for example `cdnUrl('team/ana.jpg')`. */
export function cdnUrl(file: string): string {
  return CDN + file.replace(/^\.?\//, '').replace(TO_AVIF, '.avif')
}
